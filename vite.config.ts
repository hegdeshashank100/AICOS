import { defineConfig, loadEnv, type HtmlTagDescriptor, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { randomBytes, createHash } from 'node:crypto'
import path from 'node:path'
import { MongoClient, type Db } from 'mongodb'
import { compare, hash } from 'bcryptjs'

import siteConfiguration from './.figma/make/site.json'


// Vite config — https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // .figma/make/deploy-preview passes `--mode development` for cached-preview builds.
  const emitSourcemaps = mode === 'development'

  return {
    base: process.env.FIGMA_PUBLIC_URL ? `${process.env.FIGMA_PUBLIC_URL}/` : '/',
    build: {
      sourcemap: emitSourcemaps ? 'inline' : false,
      minify: !emitSourcemaps,
    },
    plugins: [
react(),
      tailwindcss(),
openRouterApiPlugin(env.OPENROUTER_API_KEY),
aicosBackendPlugin({
  mongoUri: env.MONGODB_URI,
  mongoDb: env.MONGODB_DB || 'aicos',
  sessionTtlDays: Number(env.SESSION_TTL_DAYS || 7),
  seedDemoUsers: env.SEED_DEMO_USERS !== 'false',
}),
      figmaSiteConfiguration(siteConfiguration),
      figmaErrorOverlayReplay(),
      figmaReactRefreshBoundaryFallback(),
      figmaMakeKitPlugin({ storiesGlob: '/src/**/*.stories.{ts,tsx,js,jsx}' }),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      host: env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(env.PORT || '8443'),
      strictPort: true,
      watch: {
        ignored: [
          '**/.figma/**',
],
      },
    },
    preview: {
      host: env.FIGMA_DEV_SERVER_HOST || '0.0.0.0',
      port: parseInt(env.PORT || '8443'),
    },
  }
})

type AicosBackendOptions = {
  mongoUri?: string
  mongoDb: string
  sessionTtlDays: number
  seedDemoUsers: boolean
}

type AicosUser = {
  _id: import('mongodb').ObjectId
  email: string
  passwordHash: string
  name: string
  role: 'Admin' | 'Faculty' | 'Student'
  createdAt: Date
}

function aicosBackendPlugin(options: AicosBackendOptions): Plugin {
  let databasePromise: Promise<Db> | null = null

  const getDatabase = async () => {
    if (!options.mongoUri) {
      throw new Error('MONGODB_URI is not configured')
    }
    if (!databasePromise) {
      databasePromise = (async () => {
        const client = new MongoClient(options.mongoUri as string)
        await client.connect()
        const database = client.db(options.mongoDb)
        await database.collection<AicosUser>('users').createIndex(
          { email: 1 },
          { unique: true },
        )
        await database.collection('sessions').createIndex(
          { expiresAt: 1 },
          { expireAfterSeconds: 0 },
        )
        if (options.seedDemoUsers) {
          const demoUsers = [
            ['ananya.rao@aicos.edu', 'Dr. Ananya Rao', 'Admin'],
            ['maya.sen@aicos.edu', 'Prof. Maya Sen', 'Faculty'],
            ['arjun.nair@aicos.edu', 'Arjun Nair', 'Student'],
          ] as const
          for (const [email, name, role] of demoUsers) {
            await database.collection<AicosUser>('users').updateOne(
              { email },
              {
                $setOnInsert: {
                  email,
                  passwordHash: await hash('AicosDemo2025', 12),
                  name,
                  role,
                  createdAt: new Date(),
                },
              },
              { upsert: true },
            )
          }
        }
        return database
      })().catch((error) => {
        databasePromise = null
        throw error
      })
    }
    return databasePromise
  }

  return {
    name: 'aicos-backend',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const pathName = req.url?.split('?')[0]
        if (!pathName?.startsWith('/api/auth/')) {
          next()
          return
        }

        try {
          if (pathName === '/api/auth/login' && req.method === 'POST') {
            const body = JSON.parse(await readRequestBody(req)) as {
              email?: unknown
              password?: unknown
            }
            const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
            const password = typeof body.password === 'string' ? body.password : ''
            if (!email || !password) {
              writeJson(res, 400, { error: 'Email and password are required' })
              return
            }

            const database = await getDatabase()
            const user = await database.collection<AicosUser>('users').findOne({ email })
            if (!user || !(await compare(password, user.passwordHash))) {
              writeJson(res, 401, { error: 'Invalid email or password' })
              return
            }

            const token = randomBytes(32).toString('hex')
            const expiresAt = new Date(
              Date.now() + Math.max(1, options.sessionTtlDays) * 24 * 60 * 60 * 1000,
            )
            await database.collection('sessions').insertOne({
              tokenHash: hashSessionToken(token),
              userId: user._id,
              expiresAt,
              createdAt: new Date(),
            })
            setSessionCookie(res, token, expiresAt)
            writeJson(res, 200, { user: serializeUser(user) })
            return
          }

          if (pathName === '/api/auth/register' && req.method === 'POST') {
            const body = JSON.parse(await readRequestBody(req)) as {
              email?: unknown
              password?: unknown
              name?: unknown
              role?: unknown
            }
            const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : ''
            const password = typeof body.password === 'string' ? body.password : ''
            const name = typeof body.name === 'string' ? body.name.trim() : ''
            const role =
              body.role === 'Admin' || body.role === 'Faculty' || body.role === 'Student'
                ? body.role
                : 'Student'
            if (!email || !name || password.length < 8) {
              writeJson(res, 400, {
                error: 'Name, email, and a password of at least 8 characters are required',
              })
              return
            }

            const database = await getDatabase()
            const user: Omit<AicosUser, '_id'> = {
              email,
              passwordHash: await hash(password, 12),
              name,
              role,
              createdAt: new Date(),
            }
            try {
              const result = await database.collection('users').insertOne(user)
              const createdUser = { ...user, _id: result.insertedId } as AicosUser
              writeJson(res, 201, { user: serializeUser(createdUser) })
            } catch (error) {
              if (error instanceof Error && error.message.includes('E11000')) {
                writeJson(res, 409, { error: 'An account with this email already exists' })
                return
              }
              throw error
            }
            return
          }

          if (pathName === '/api/auth/me' && req.method === 'GET') {
            const user = await getSessionUser(req, getDatabase)
            if (!user) {
              writeJson(res, 401, { error: 'Not authenticated' })
              return
            }
            writeJson(res, 200, { user: serializeUser(user) })
            return
          }

          if (pathName === '/api/auth/logout' && req.method === 'POST') {
            const token = readSessionCookie(req)
            if (token) {
              const database = await getDatabase()
              await database.collection('sessions').deleteOne({
                tokenHash: hashSessionToken(token),
              })
            }
            clearSessionCookie(res)
            writeJson(res, 200, { ok: true })
            return
          }

          writeJson(res, 405, { error: 'Unsupported authentication request' })
        } catch (error) {
          console.error('AICOS backend error:', error)
          const message =
            error instanceof Error && error.message === 'MONGODB_URI is not configured'
              ? error.message
              : 'Backend request failed'
          writeJson(res, message === 'MONGODB_URI is not configured' ? 503 : 500, {
            error: message,
          })
        }
      })
    },
  }
}

function serializeUser(user: AicosUser) {
  return {
    id: user._id.toString(),
    email: user.email,
    name: user.name,
    role: user.role,
  }
}

async function getSessionUser(
  req: import('node:http').IncomingMessage,
  getDatabase: () => Promise<Db>,
) {
  const token = readSessionCookie(req)
  if (!token) return null
  const database = await getDatabase()
  const session = await database.collection('sessions').findOne({
    tokenHash: hashSessionToken(token),
    expiresAt: { $gt: new Date() },
  })
  if (!session) return null
  return database.collection<AicosUser>('users').findOne({ _id: session.userId })
}

function hashSessionToken(token: string) {
  return createHash('sha256').update(token).digest('hex')
}

function readSessionCookie(req: import('node:http').IncomingMessage) {
  const cookies = req.headers.cookie?.split(';') ?? []
  const sessionCookie = cookies.find((cookie) => cookie.trim().startsWith('aicos_session='))
  return sessionCookie?.trim().slice('aicos_session='.length) || null
}

function setSessionCookie(
  res: import('node:http').ServerResponse,
  token: string,
  expiresAt: Date,
) {
  res.setHeader(
    'Set-Cookie',
    `aicos_session=${token}; HttpOnly; Path=/; SameSite=Lax; Expires=${expiresAt.toUTCString()}`,
  )
}

function clearSessionCookie(res: import('node:http').ServerResponse) {
  res.setHeader('Set-Cookie', 'aicos_session=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0')
}

function writeJson(res: import('node:http').ServerResponse, status: number, body: unknown) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json')
  res.end(JSON.stringify(body))
}

function openRouterApiPlugin(apiKey: string | undefined): Plugin {
  return {
    name: 'openrouter-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/ai') {
          next()
          return
        }

        if (req.method !== 'POST') {
          res.statusCode = 405
          res.setHeader('Allow', 'POST')
          res.end(JSON.stringify({ error: 'Method not allowed' }))
          return
        }

        if (!apiKey) {
          res.statusCode = 503
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'OPENROUTER_API_KEY is not configured' }))
          return
        }

        try {
          const body = await readRequestBody(req)
          const parsed = JSON.parse(body) as { prompt?: unknown; context?: unknown }
          const prompt = typeof parsed.prompt === 'string' ? parsed.prompt.trim() : ''
          const context = typeof parsed.context === 'string' ? parsed.context.trim() : ''

          if (!prompt || prompt.length > 8000 || context.length > 4000) {
            res.statusCode = 400
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: 'Invalid prompt or context' }))
            return
          }

          const upstream = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${apiKey}`,
              'Content-Type': 'application/json',
              'HTTP-Referer': 'http://localhost:8443',
              'X-Title': 'AICOS Web Application',
            },
            body: JSON.stringify({
              model: 'openai/gpt-4o-mini',
              messages: [
                {
                  role: 'system',
                  content:
                    'You are a concise academic assistant. Give practical, safe guidance. Do not invent institutional records, grades, or eligibility decisions. Say when information is missing.',
                },
                ...(context ? [{ role: 'system', content: context }] : []),
                { role: 'user', content: prompt },
              ],
              temperature: 0.2,
              max_tokens: 500,
            }),
          })

          const responseText = await upstream.text()
          if (!upstream.ok) {
            let message = `OpenRouter request failed (${upstream.status})`
            try {
              const errorResponse = JSON.parse(responseText) as {
                error?: { message?: unknown }
              }
              if (typeof errorResponse.error?.message === 'string') {
                message = errorResponse.error.message
              }
            } catch {
              console.error('OpenRouter returned an invalid error response')
            }
            res.statusCode = upstream.status
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: message }))
            return
          }

          const response = JSON.parse(responseText) as {
            error?: { message?: unknown }
            choices?: Array<{
              message?: {
                content?: unknown
              }
            }>
            usage?: { completion_tokens?: number }
          }
          if (response.error) {
            const message =
              typeof response.error.message === 'string'
                ? response.error.message
                : 'OpenRouter returned an error'
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: message }))
            return
          }

          const content = response.choices?.[0]?.message?.content
          const answer =
            typeof content === 'string'
              ? content
              : Array.isArray(content)
                ? content
                    .map((part) =>
                      typeof part === 'object' &&
                      part !== null &&
                      'text' in part &&
                      typeof part.text === 'string'
                        ? part.text
                        : '',
                    )
                    .join('')
                : ''
          if (!answer.trim()) {
            res.statusCode = 502
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                error: `OpenRouter returned no usable text (completion tokens: ${
                  response.usage?.completion_tokens ?? 0
                })`,
              }),
            )
            return
          }

          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ answer: answer.trim() }))
        } catch (error) {
          console.error('OpenRouter proxy error:', error)
          res.statusCode = 502
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify({ error: 'Unable to reach OpenRouter' }))
        }
      })
    },
  }
}

async function readRequestBody(req: import('node:http').IncomingMessage): Promise<string> {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(Buffer.from(chunk))
    if (Buffer.concat(chunks).length > 12000) {
      throw new Error('Request body too large')
    }
  }
  return Buffer.concat(chunks).toString('utf8')
}

type FigmaSiteConfiguration = {
  title?: string
  description?: string
  language?: string
  robots?: {
    index?: boolean
  }
  icons?: {
    icon?: string
  }
  openGraph?: {
    image?: string
  }
  analytics?: {
    googleAnalyticsId?: string
  }
  customScripts?: {
    headStart?: string
    headEnd?: string
    bodyStart?: string
    bodyEnd?: string
  }
  accessibility?: {
    addBypassLinks?: boolean
  }
}

/** Applies /.figma/make/site.json to the generated document shell. */
function figmaSiteConfiguration(config: FigmaSiteConfiguration): Plugin {
  function sanitizeHtmlValue(value: string | undefined): string {
    return value?.replace(/[^a-zA-Z0-9_-]/g, '') || ''
  }
  function escapeHtmlText(value: string): string {
    return value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  }
  function replaceHtmlCommentSlot(html: string, slotName: string, content: string): string {
    return html.replace(`<!-- ${slotName} -->`, content)
  }

  const title = config.title ?? "Figma Make App"
  const description = config.description ?? ''
  // Imported HTML keeps its own favicon; new Makes default to the Make product icon.
  const favicon = config.icons?.icon ?? '/favicon.svg'
  const socialImage = config.openGraph?.image ?? ''
  const language = sanitizeHtmlValue(config.language) || 'en'
  const googleAnalyticsId = sanitizeHtmlValue(config.analytics?.googleAnalyticsId)
  const headStart = config.customScripts?.headStart ?? ''
  const headEnd = config.customScripts?.headEnd ?? ''
  const bodyStart = config.customScripts?.bodyStart ?? ''
  const bodyEnd = config.customScripts?.bodyEnd ?? ''
  const robotsTxt = config.robots?.index === false ? 'User-agent: *\nDisallow: /\n' : ''

  return {
    name: 'figma-site-configuration',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!robotsTxt || req.url?.split('?')[0] !== '/robots.txt') return next()

        res.setHeader('Content-Type', 'text/plain; charset=utf-8')
        res.end(robotsTxt)
      })
    },
    generateBundle() {
      if (!robotsTxt) return

      this.emitFile({
        type: 'asset',
        fileName: 'robots.txt',
        source: robotsTxt,
      })
    },
    transformIndexHtml: {
      order: 'pre',
      handler(html) {
        let result = html
        result = replaceHtmlCommentSlot(result, 'figma:lang', language)
        result = replaceHtmlCommentSlot(result, 'figma:title', escapeHtmlText(title))
        result = replaceHtmlCommentSlot(result, 'figma:head-start', headStart)
        result = replaceHtmlCommentSlot(result, 'figma:head-end', headEnd)
        result = replaceHtmlCommentSlot(result, 'figma:body-start', bodyStart)
        result = replaceHtmlCommentSlot(result, 'figma:body-end', bodyEnd)

        const tags: HtmlTagDescriptor[] = []
        if (description) {
          tags.push({ tag: 'meta', attrs: { name: 'description', content: description }, injectTo: 'head' })
        }
        if (config.robots?.index === false) {
          tags.push({ tag: 'meta', attrs: { name: 'robots', content: 'noindex, nofollow' }, injectTo: 'head' })
        }
        if (favicon) {
          tags.push({ tag: 'link', attrs: { rel: 'icon', href: favicon }, injectTo: 'head' })
        }
        if (title) {
          tags.push({ tag: 'meta', attrs: { property: 'og:title', content: title }, injectTo: 'head' })
        }
        if (description) {
          tags.push({ tag: 'meta', attrs: { property: 'og:description', content: description }, injectTo: 'head' })
        }
        if (socialImage) {
          tags.push(
            { tag: 'meta', attrs: { property: 'og:image', content: socialImage }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' }, injectTo: 'head' },
            { tag: 'meta', attrs: { name: 'twitter:image', content: socialImage }, injectTo: 'head' },
          )
        }

        if (googleAnalyticsId) {
          tags.push(
            {
              tag: 'script',
              attrs: {
                async: true,
                src: `https://www.googletagmanager.com/gtag/js?id=${googleAnalyticsId}`,
              },
              injectTo: 'head',
            },
            {
              tag: 'script',
              children: `
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', ${JSON.stringify(googleAnalyticsId)});
`,
              injectTo: 'head',
            },
          )
        }

        if (config.accessibility?.addBypassLinks) {
          tags.push(
            {
              tag: 'style',
              children: `
  .figma-bypass-link {
    position: fixed;
    top: 8px;
    left: 8px;
    z-index: 2147483647;
    transform: translateY(-150%);
    border-radius: 6px;
    background: #111827;
    color: #fff;
    padding: 8px 12px;
    font: 600 14px/1.2 system-ui, sans-serif;
    text-decoration: none;
  }
  .figma-bypass-link:focus {
    transform: translateY(0);
  }
`,
              injectTo: 'head',
            },
            {
              tag: 'a',
              attrs: { class: 'figma-bypass-link', href: '#root' },
              children: 'Skip to content',
              injectTo: 'body-prepend',
            },
          )
        }

        return {
          html: result,
          tags,
        }
      },
    },
  }
}

/**
 * Replay the most recent build error to clients that connect after
 * it was first broadcast. Vite buffers an error payload only while
 * no clients are connected and clears the buffer on the first
 * reconnect (see `bufferedMessage` in `createWebSocketServer`), so
 * if the preview iframe reloads after Vite already delivered an
 * error to a live socket, the new socket misses the payload and
 * the overlay stays hidden even though the build is still broken.
 * We intercept `ws.send` to remember the latest error and replay
 * it on every new connection; the cache clears on a successful
 * `update` or `full-reload` so a stale overlay can't survive a
 * fixed build.
 */
function figmaErrorOverlayReplay(): Plugin {
  return {
    name: 'figma-error-overlay-replay',
    apply: 'serve',
    configureServer(server) {
      let lastError: object | null = null

      const origSend = server.ws.send.bind(server.ws) as (...args: any[]) => void
      server.ws.send = ((...args: any[]) => {
        const payload = args[0]
        if (payload && typeof payload === 'object' && !Array.isArray(payload)) {
          const type = (payload as { type?: string }).type
          if (type === 'error') {
            lastError = payload as object
          } else if (type === 'update' || type === 'full-reload') {
            lastError = null
          }
        }
        return origSend(...args)
      }) as typeof server.ws.send

      server.ws.on('connection', (socket) => {
        if (lastError !== null) {
          socket.send(JSON.stringify(lastError))
        }
      })
    },
  }
}

/**
 * Reload when a module that previously defined a React Refresh boundary stops
 * defining one. This happens when an agent moves a component into a new file
 * and replaces the old module with a re-export:
 *
 *   export { default } from './app/App'
 *
 * Vite otherwise accepts the update using the previous module's HMR boundary,
 * but the re-export-only transform no longer registers a replacement for the
 * mounted component family. React reports a successful refresh while leaving
 * the old tree mounted until the page is reloaded.
 */
function figmaReactRefreshBoundaryFallback(): Plugin {
  type ModuleNode = import('vite').ModuleNode
  const hadRefreshBoundary = new Map<string, boolean>()
  const lostRefreshBoundaries = new Set<string>()
  let sendFullReload: (() => void) | null = null

  return {
    name: 'figma-react-refresh-boundary-fallback',
    apply: 'serve',
    enforce: 'post',
    configureServer(server) {
      sendFullReload = () => server.ws.send({ type: 'full-reload', path: '*' })
    },
    handleHotUpdate({ modules, server, timestamp }) {
      if (lostRefreshBoundaries.size === 0) return

      const visited = new Set<ModuleNode>()
      const pending = [...modules]
      while (pending.length > 0) {
        const current = pending.pop()
        if (!current || visited.has(current)) continue
        visited.add(current)

        const moduleId = current.id?.split('?')[0]
        if (moduleId && lostRefreshBoundaries.has(moduleId)) {
          const invalidated = new Set<ModuleNode>()
          for (const updatedModule of modules) {
            server.moduleGraph.invalidateModule(updatedModule, invalidated, timestamp, true)
          }
          sendFullReload?.()
          return []
        }

        pending.push(...current.importers)
      }
    },
    transform(code, id) {
      if (!/\.[jt]sx?(?:\?|$)/.test(id) || id.includes('/node_modules/')) return null

      const moduleId = id.split('?')[0] ?? id
      const hasRefreshBoundary = code.includes('registerExportsForReactRefresh')
      const previousHadRefreshBoundary = hadRefreshBoundary.get(moduleId)
      hadRefreshBoundary.set(moduleId, hasRefreshBoundary)

      if (hasRefreshBoundary) lostRefreshBoundaries.delete(moduleId)
      if (previousHadRefreshBoundary && !hasRefreshBoundary) {
        lostRefreshBoundaries.add(moduleId)
        queueMicrotask(() => sendFullReload?.())
      }

      return null
    },
  }
}

/**
 * Serves a blank render-target page at /.figma/make/kit.html that
 * the Figma preview script drives directly. The page exposes a
 * registry of every file matching `storiesGlob` on
 * window.__FIGMA__.stories so the design surface can dynamically
 * import + mount each entry into its own grid view.
 *
 * Dev-only: `apply: 'serve'` gates the plugin to `vite dev`. Prod
 * builds (`vite build`) skip it entirely so the route doesn't leak
 * into shipped bundles.
 */
function figmaMakeKitPlugin(options: { storiesGlob: string | string[] }): Plugin {
  const storiesGlob = Array.isArray(options.storiesGlob) ? options.storiesGlob : [options.storiesGlob]
  const ROUTE = '/.figma/make/kit.html'
  const VIRTUAL_ID = 'virtual:figma-stories'
  const RESOLVED_ID = '\0' + VIRTUAL_ID
  const STORIES_MODULE = `export const stories = import.meta.glob(${JSON.stringify(storiesGlob)})`
  const HTML_BOOTSTRAP = `<!doctype html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body>
<div id="figma-make-kit-root"></div>
<script type="module">
  import { stories } from 'virtual:figma-stories'
  window.__FIGMA__ = Object.assign(window.__FIGMA__ ?? {}, { stories })
  window.dispatchEvent(new CustomEvent('figma.ready'))
</script>
</body>
</html>`

  return {
    name: 'figma-make-kit',
    apply: 'serve',
    resolveId(id) {
      if (id === VIRTUAL_ID) return RESOLVED_ID
      return null
    },
    load(id) {
      if (id !== RESOLVED_ID) return null
      return STORIES_MODULE
    },
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url || ''
        if (url.split('?')[0] !== ROUTE) return next()

        try {
          res.setHeader('Content-Type', 'text/html')
          res.end(await server.transformIndexHtml(url, HTML_BOOTSTRAP))
        } catch (err) {
          next(err as Error)
        }
      })
    },
  }
}
