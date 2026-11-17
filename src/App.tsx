import { useEffect, useMemo, useState, type ReactElement } from "react"

type Role = "Admin" | "Faculty" | "Student"
type IconName = "home" | "people" | "book" | "calendar" | "assignment" | "chart" | "sparkle" | "report" | "settings" | "search" | "bell" | "chevron" | "menu" | "close" | "arrow" | "clock" | "check" | "warning" | "more" | "plus" | "download" | "play" | "eye"

async function askAI(prompt: string, context: string) {
  const response = await fetch("/api/ai", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ prompt, context }),
  })
  const data = (await response.json()) as { answer?: string; error?: string }
  if (!response.ok || !data.answer) {
    throw new Error(data.error || "The AI assistant could not respond.")
  }
  return data.answer
}

function cleanAIText(value: string) {
  return value
    .replace(/\r\n/g, "\n")
    .replace(/^\s*#{1,6}\s*/gm, "")
    .replace(/\*\*(.*?)\*\*/g, "$1")
    .replace(/__(.*?)__/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/^\s*[-*]\s+/gm, "• ")
    .replace(/\n{3,}/g, "\n\n")
    .trim()
}

function AIResponse({ text, className = "" }: { text: string; className?: string }) {
  return <p className={`ai-response ${className}`.trim()}>{cleanAIText(text)}</p>
}

const paths: Record<IconName, ReactElement> = {
  home: (
    <>
      <path d="M3 10.5 12 3l9 7.5" />
      <path d="M5 9.5V21h14V9.5M9 21v-7h6v7" />
    </>
  ),
  people: (
    <>
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
    </>
  ),
  book: (
    <>
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20V4H6.5A2.5 2.5 0 0 0 4 6.5z" />
      <path d="M4 6.5v13M8 8h8" />
    </>
  ),
  calendar: (
    <>
      <rect x="3" y="5" width="18" height="16" rx="2" />
      <path d="M16 3v4M8 3v4M3 10h18M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01" />
    </>
  ),
  assignment: (
    <>
      <path d="M9 5h6M9 3h6v4H9z" />
      <path d="M9 5H5v16h14V5h-4M8 12h8M8 16h5" />
    </>
  ),
  chart: (
    <>
      <path d="M4 19V9M10 19V5M16 19v-7M22 19H2" />
    </>
  ),
  sparkle: (
    <>
      <path d="m12 3 1.4 4.1L17.5 8.5l-4.1 1.4L12 14l-1.4-4.1-4.1-1.4 4.1-1.4zM19 15l.7 2.3L22 18l-2.3.7L19 21l-.7-2.3L16 18l2.3-.7z" />
    </>
  ),
  report: (
    <>
      <path d="M6 2h9l4 4v16H6z" />
      <path d="M14 2v5h5M9 13h6M9 17h6M9 9h2" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06A1.7 1.7 0 0 0 15 19.4a1.7 1.7 0 0 0-1 .6 1.7 1.7 0 0 0-.4 1.1V21h-4v-.09A1.7 1.7 0 0 0 8.6 19.4a1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-.6-1 1.7 1.7 0 0 0-1.1-.4H3v-4h.09A1.7 1.7 0 0 0 4.6 8.6a1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-.6 1.7 1.7 0 0 0 .4-1.1V3h4v.09A1.7 1.7 0 0 0 15.4 4.6a1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9c.14.35.35.69.6 1 .3.32.7.46 1.1.4h.09v4h-.09A1.7 1.7 0 0 0 19.4 15Z" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-4-4" />
    </>
  ),
  bell: (
    <>
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M10 21h4" />
    </>
  ),
  chevron: <path d="m9 18 6-6-6-6" />,
  menu: <path d="M4 7h16M4 12h16M4 17h16" />,
  close: <path d="m6 6 12 12M18 6 6 18" />,
  arrow: <path d="M5 12h14M13 6l6 6-6 6" />,
  clock: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </>
  ),
  check: <path d="m5 12 4 4L19 6" />,
  warning: (
    <>
      <path d="m12 3 10 18H2z" />
      <path d="M12 9v5M12 18h.01" />
    </>
  ),
  more: (
    <>
      <circle cx="5" cy="12" r="1" />
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
    </>
  ),
  plus: <path d="M12 5v14M5 12h14" />,
  download: (
    <>
      <path d="M12 3v12M7 10l5 5 5-5M5 21h14" />
    </>
  ),
  play: <path d="m8 5 11 7-11 7z" />,
  eye: (
    <>
      <path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
}

function Icon({ name, size = 18 }: { name: IconName; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

const nav: Record<Role, { label: string; icon: IconName }[]> = {
  Admin: [
    { label: "Overview", icon: "home" },
    { label: "Students", icon: "people" },
    { label: "Faculty", icon: "people" },
    { label: "Academic configuration", icon: "book" },
    { label: "Enrollments", icon: "assignment" },
    { label: "Analytics", icon: "chart" },
    { label: "AI institution assistant", icon: "sparkle" },
    { label: "Reports & audit", icon: "report" },
  ],
  Faculty: [
    { label: "Overview", icon: "home" },
    { label: "My classes", icon: "book" },
    { label: "Attendance", icon: "calendar" },
    { label: "Assignments", icon: "assignment" },
    { label: "AI evaluation", icon: "sparkle" },
    { label: "Exams & results", icon: "report" },
    { label: "Class intelligence", icon: "chart" },
  ],
  Student: [
    { label: "Overview", icon: "home" },
    { label: "My subjects", icon: "book" },
    { label: "Assignments", icon: "assignment" },
    { label: "Attendance", icon: "calendar" },
    { label: "Exams & results", icon: "report" },
    { label: "AI evaluation", icon: "sparkle" },
    { label: "AI study plan", icon: "sparkle" },
    { label: "AI learning studio", icon: "sparkle" },
    { label: "Placement readiness", icon: "chart" },
  ],
}

function Button({
  children,
  variant = "primary",
  icon,
  onClick,
  className = "",
}: {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "outline" | "ghost"
  icon?: IconName
  onClick?: () => void
  className?: string
}) {
  return (
    <button
      type="button"
      className={`btn btn-${variant} ${className}`}
      onClick={onClick}
    >
      {icon && <Icon name={icon} size={16} />}
      <span>{children}</span>
    </button>
  )
}

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode
  tone?: "success" | "warning" | "rose" | "neutral" | "moss"
}) {
  return <span className={`badge badge-${tone}`}>{children}</span>
}

function Card({
  children,
  className = "",
}: {
  children: React.ReactNode
  className?: string
}) {
  return <section className={`card ${className}`}>{children}</section>
}

function Avatar({
  initials = "AN",
  small = false,
}: {
  initials?: string
  small?: boolean
}) {
  return (
    <span className={`avatar ${small ? "avatar-small" : ""}`}>{initials}</span>
  )
}

function Progress({
  value,
  tone = "olive",
}: {
  value: number
  tone?: "olive" | "rose" | "moss"
}) {
  return (
    <div className="progress" aria-label={`${value}%`}>
      <span className={`progress-${tone}`} style={{ width: `${value}%` }} />
    </div>
  )
}

const roleMeta = {
  Admin: {
    name: "Dr. Ananya Rao",
    initials: "AR",
    greeting: "Institution overview",
    sub: "Monitor academic operations and act on priority insights.",
  },
  Faculty: {
    name: "Prof. Maya Sen",
    initials: "MS",
    greeting: "Good morning, Maya",
    sub: "Here is what needs your attention across your classes.",
  },
  Student: {
    name: "Arjun Nair",
    initials: "AN",
    greeting: "Good morning, Arjun",
    sub: "You’re making steady progress. Keep the momentum going.",
  },
}

const studentAcademicProfile = {
  name: "Arjun Nair",
  studentId: "2AB21CS042",
  email: "arjun.nair@aicos.edu",
  phone: "+91 98765 24108",
  dateOfBirth: "14 September 2005",
  department: "Computer Science and Design Engineering",
  departmentCode: "CSD",
  degree: "BE",
  program: "Computer Science and Design Engineering",
  admissionYear: 2023,
  duration: 4,
  graduationYear: 2027,
  academicYear: "Year 4",
  semester: "Semester 7",
  semesterShort: "7th",
  session: "2026–2027",
  section: "A",
  curriculum: "CSD-2023 · Version 2",
  enrollmentStatus: "Active",
}

const allocatedSubjects = [
  {
    name: "Machine Learning",
    code: "BCS701",
    credits: 4,
    faculty: "Prof. Maya Sen",
    attendance: 95,
    assignment: "1 due",
    result: "Not published",
    type: "Core",
  },
  {
    name: "Deep Learning",
    code: "BCS714A",
    credits: 3,
    faculty: "Dr. R. Kulkarni",
    attendance: 83.3,
    assignment: "Submitted",
    result: "Published",
    type: "Program elective",
  },
  {
    name: "Computer Networks",
    code: "BCS702",
    credits: 4,
    faculty: "Prof. A. Patil",
    attendance: 75,
    assignment: "2 pending",
    result: "Not published",
    type: "Core",
  },
  {
    name: "Cloud Computing",
    code: "BCS703",
    credits: 3,
    faculty: "Prof. Maya Sen",
    attendance: 61.1,
    assignment: "1 due",
    result: "Not published",
    type: "Core",
  },
  {
    name: "Project Management",
    code: "BCS704",
    credits: 2,
    faculty: "Dr. K. Joshi",
    attendance: 56.3,
    assignment: "Submitted",
    result: "Published",
    type: "Humanities",
  },
]

type FacultyRecord = {
  id: string
  name: string
  email: string
  phone: string
  department: string
  designation: string
  qualification: string
  specialization: string
  status: "Active" | "Inactive"
  subjects: string[]
  classes: string[]
  photo?: string
}

const initialFacultyRecords: FacultyRecord[] = [
  {
    id: "FAC001",
    name: "Dr. Ananya Rao",
    email: "ananya.rao@aicos.edu",
    phone: "+91 98451 78002",
    department: "Computer Science and Design Engineering",
    designation: "Professor",
    qualification: "Ph.D. in Computer Science",
    specialization: "Artificial Intelligence",
    status: "Active",
    subjects: ["Machine Learning (BCS701)"],
    classes: ["Semester 7 · Section A"],
  },
  {
    id: "FAC002",
    name: "Prof. Kiran Kumar",
    email: "kiran.kumar@aicos.edu",
    phone: "+91 98450 11842",
    department: "Computer Science and Design Engineering",
    designation: "Assistant Professor",
    qualification: "M.Tech in Computer Science",
    specialization: "Cloud Computing",
    status: "Active",
    subjects: ["Cloud Computing (BCS703)"],
    classes: ["Semester 7 · Section A"],
  },
  {
    id: "FAC003",
    name: "Dr. Meera Nair",
    email: "meera.nair@aicos.edu",
    phone: "+91 98861 44013",
    department: "Information Technology",
    designation: "Associate Professor",
    qualification: "Ph.D. in Information Systems",
    specialization: "Data Engineering",
    status: "Active",
    subjects: ["Database Systems (BIT502)"],
    classes: ["Semester 5 · Section B"],
  },
  {
    id: "FAC004",
    name: "Prof. Rahul Sharma",
    email: "rahul.sharma@aicos.edu",
    phone: "+91 99004 22816",
    department: "Mechanical Engineering",
    designation: "Lecturer",
    qualification: "M.Tech in Mechanical Engineering",
    specialization: "Manufacturing Systems",
    status: "Active",
    subjects: ["Manufacturing Process (BME401)"],
    classes: ["Semester 4 · Section A"],
  },
  {
    id: "FAC005",
    name: "Dr. Priya Shetty",
    email: "priya.shetty@aicos.edu",
    phone: "+91 97413 55208",
    department: "Computer Science and Design Engineering",
    designation: "Assistant Professor",
    qualification: "Ph.D. in Computer Science",
    specialization: "Deep Learning",
    status: "Inactive",
    subjects: ["Deep Learning (BCS714A)"],
    classes: ["Semester 7 · Section A"],
  },
]

function Sidebar({
  role,
  active,
  setActive,
  open,
  close,
}: {
  role: Role
  active: string
  setActive: (v: string) => void
  open: boolean
  close: () => void
}) {
  return (
    <aside className={`sidebar ${open ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-mark">
          <span>A</span>
        </div>
        <div>
          <strong>AICOS</strong>
          <small>College Operating System</small>
        </div>
        <button
          className="icon-btn sidebar-close"
          onClick={close}
          aria-label="Close navigation"
        >
          <Icon name="close" />
        </button>
      </div>
      <div className="workspace-label">WORKSPACE</div>
      <nav>
        {nav[role].map((item) => (
          <button
            key={item.label}
            className={`nav-item ${active === item.label ? "active" : ""}`}
            onClick={() => {
              setActive(item.label)
              close()
            }}
          >
            <Icon name={item.icon} />
            <span>{item.label}</span>
            {item.label === "Assignments" && role !== "Admin" && <i>3</i>}
          </button>
        ))}
      </nav>
      <div className="sidebar-foot">
        <div className="support-card">
          <span className="support-icon">
            <Icon name="sparkle" />
          </span>
          <strong>Need guidance?</strong>
          <p>Explore the AICOS help centre.</p>
          <button>
            Open help centre <Icon name="arrow" size={14} />
          </button>
        </div>
        <button className="nav-item">
          <Icon name="settings" />
          <span>Settings</span>
        </button>
      </div>
    </aside>
  )
}

function Topbar({
  role,
  onMenu,
  onSignOut,
  onNavigate,
}: {
  role: Role
  onMenu: () => void
  onSignOut: () => void
  onNavigate: (page: string) => void
}) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [noticeOpen, setNoticeOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  return (
    <header className="topbar">
      <button
        className="icon-btn menu-btn"
        onClick={onMenu}
        aria-label="Open navigation"
      >
        <Icon name="menu" />
      </button>
      <div className="search-wrap">
        <Icon name="search" />
        <input
          aria-label="Global search"
          placeholder="Search people, subjects, assignments…"
          onFocus={() => setSearchOpen(true)}
        />
        {searchOpen && (
          <div className="search-popover popover">
            <div className="popover-title">
              <span>Quick results</span>
              <button onClick={() => setSearchOpen(false)}>
                <Icon name="close" size={16} />
              </button>
            </div>
            <button
              className="search-result"
              onClick={() => {
                onNavigate(
                  role === "Student"
                    ? "My subjects"
                    : role === "Faculty"
                      ? "My classes"
                      : "Academic configuration",
                )
                setSearchOpen(false)
              }}
            >
              <span className="result-icon">
                <Icon name="book" />
              </span>
              <span>
                <strong>Data Structures</strong>
                <small>Subject · CS204</small>
              </span>
              <kbd>↗</kbd>
            </button>
            <button
              className="search-result"
              onClick={() => {
                onNavigate(
                  role === "Admin"
                    ? "Students"
                    : role === "Faculty"
                      ? "My classes"
                      : "My subjects",
                )
                setSearchOpen(false)
              }}
            >
              <Avatar initials="RM" small />
              <span>
                <strong>Riya Mehta</strong>
                <small>Student · B.Tech CSE</small>
              </span>
              <kbd>↗</kbd>
            </button>
            <div className="search-hint">Press Enter to view all results</div>
          </div>
        )}
      </div>
      <div className="top-actions">
        <div className="relative">
          <button
            className="icon-btn notice-btn"
            onClick={() => setNoticeOpen(!noticeOpen)}
            aria-label="Notifications"
          >
            <Icon name="bell" />
            <span />
          </button>
          {noticeOpen && (
            <div className="notice-popover popover">
              <div className="popover-title">
                <span>Notifications</span>
                <Badge tone="rose">3 new</Badge>
              </div>
              {[
                "Attendance alert for CS204",
                "New assignment published",
                "Results ready for review",
              ].map((n, i) => (
                <button
                  className="notice-item"
                  key={n}
                  onClick={() => {
                    onNavigate(
                      i === 0
                        ? role === "Admin"
                          ? "Analytics"
                          : "Attendance"
                        : i === 1
                          ? role === "Admin"
                            ? "Reports & audit"
                            : "Assignments"
                          : role === "Admin"
                            ? "Reports & audit"
                            : "Exams & results",
                    )
                    setNoticeOpen(false)
                  }}
                >
                  <i className={i === 0 ? "sage-dot" : "rose-dot"} />
                  <span>
                    <strong>{n}</strong>
                    <small>
                      {i + 1} hour{i ? "s" : ""} ago
                    </small>
                  </span>
                </button>
              ))}
              <Button
                variant="ghost"
                onClick={() => {
                  onNavigate("Notifications")
                  setNoticeOpen(false)
                }}
              >
                View all notifications
              </Button>
            </div>
          )}
        </div>
        <div className="divider" />
        <div className="relative">
          <button
            className="profile-button"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <Avatar initials={roleMeta[role].initials} />
            <span>
              <strong>{roleMeta[role].name}</strong>
              <small>
                {role === "Student" ? "2AB21CS042 · Student" : role}
              </small>
            </span>
            <Icon name="chevron" size={15} />
          </button>
          {profileOpen && (
            <div className="profile-popover popover">
              <div className="profile-card">
                <Avatar initials={roleMeta[role].initials} />
                <span>
                  <strong>{roleMeta[role].name}</strong>
                  <small>{role.toLowerCase()}@aicos.edu</small>
                </span>
              </div>
              <button onClick={() => onNavigate("Profile")}>
                <Icon name="people" /> View profile
              </button>
              <button onClick={() => onNavigate("Edit Profile")}>
                <Icon name="assignment" /> Edit profile
              </button>
              <button onClick={() => onNavigate("Account Settings")}>
                <Icon name="settings" /> Account settings
              </button>
              <button className="signout" onClick={onSignOut}>
                <Icon name="arrow" /> Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}

function Login({ onLogin }: { onLogin: (role: Role) => void }) {
  const [loginRole, setLoginRole] = useState<Role>("Admin")
  const [email, setEmail] = useState("ananya.rao@aicos.edu")
  const [password, setPassword] = useState("AicosDemo2025")
  const [show, setShow] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const [errorMessage, setErrorMessage] = useState(
    "Check your email and password, then try again.",
  )
  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.includes("@") || password.length < 8) {
      setError(true)
      return
    }
    setError(false)
    setLoading(true)
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      })
      const data = (await response.json()) as {
        user?: { role?: Role }
        error?: string
      }
      if (!response.ok || !data.user?.role) {
        throw new Error(data.error || "Unable to sign in.")
      }
      onLogin(data.user.role)
    } catch (loginError) {
      setError(true)
      setErrorMessage(
        loginError instanceof Error
          ? loginError.message
          : "Unable to sign in.",
      )
    } finally {
      setLoading(false)
    }
  }
  const chooseRole = (nextRole: Role) => {
    setLoginRole(nextRole)
    setError(false)
    setErrorMessage("Check your email and password, then try again.")
    setEmail(
      nextRole === "Admin"
        ? "ananya.rao@aicos.edu"
        : nextRole === "Faculty"
          ? "maya.sen@aicos.edu"
          : "arjun.nair@aicos.edu",
    )
  }
  return (
    <div className="login-page">
      <section className="login-story">
        <div className="login-brand">
          <div className="brand-mark">
            <span>A</span>
          </div>
          <div>
            <strong>AICOS</strong>
            <small>AI-Based College Operating System</small>
          </div>
        </div>
        <div className="login-copy">
          <span className="login-kicker">ONE CONNECTED CAMPUS</span>
          <h1>
            Academic clarity,
            <br />
            from admission to achievement.
          </h1>
          <p>
            A secure, role-aware workspace for college administration, faculty,
            and students.
          </p>
          <div className="login-proof">
            <div>
              <Icon name="chart" />
              <span>
                <strong>Insightful</strong>Evidence-led academic decisions
              </span>
            </div>
            <div>
              <Icon name="check" />
              <span>
                <strong>Accountable</strong>Clear reviews and audit history
              </span>
            </div>
            <div>
              <Icon name="sparkle" />
              <span>
                <strong>AI-assisted</strong>Helpful, always human-controlled
              </span>
            </div>
          </div>
        </div>
        <div className="garden-motif">
          <i />
          <i />
          <i />
        </div>
        <small className="login-copyright">
          AICOS · College Operating System
        </small>
      </section>
      <section className="login-form-wrap">
        <form className="login-form" onSubmit={submit}>
          <div className="login-mobile-brand">
            <div className="brand-mark">
              <span>A</span>
            </div>
            <strong>AICOS</strong>
          </div>
          <span className="welcome-mark">
            <Icon name="book" />
          </span>
          <h2>Welcome back</h2>
          <p>Select your portal and sign in with your institutional account.</p>
          <div className="login-role-picker" aria-label="Choose portal">
            {(["Admin", "Faculty", "Student"] as Role[]).map((portalRole) => (
              <button
                type="button"
                className={loginRole === portalRole ? "active" : ""}
                onClick={() => chooseRole(portalRole)}
                key={portalRole}
              >
                <span>
                  <Icon
                    name={
                      portalRole === "Admin"
                        ? "settings"
                        : portalRole === "Faculty"
                          ? "book"
                          : "people"
                    }
                  />
                </span>
                <strong>{portalRole}</strong>
                <small>
                  {portalRole === "Admin"
                    ? "Operations"
                    : portalRole === "Faculty"
                      ? "Teaching"
                      : "Learning"}
                </small>
              </button>
            ))}
          </div>
          {error && (
            <div className="login-error">
              <Icon name="warning" />
              <span>
                <strong>Unable to sign in</strong>{errorMessage}
              </span>
            </div>
          )}
          <label className={error ? "invalid" : ""}>
            Institutional email
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@college.edu"
            />
          </label>
          <label className={error ? "invalid" : ""}>
            Password
            <div className="password-field">
              <input
                type={show ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                aria-label={show ? "Hide password" : "Show password"}
              >
                <Icon name="eye" />
              </button>
            </div>
          </label>
          <div className="login-options">
            <label>
              <input type="checkbox" defaultChecked />
              Keep me signed in
            </label>
            <button type="button">Forgot password?</button>
          </div>
          <button
            className={`btn btn-primary login-submit ${
              loading ? "loading" : ""
            }`}
            disabled={loading}
          >
            {loading ? "Signing you in…" : `Sign in to ${loginRole} portal`}
          </button>
          <div className="login-help">
            <Icon name="warning" />
            <span>
              Need access? Contact your institution’s AICOS administrator.
            </span>
          </div>
          <small className="security-note">
            Your role and permissions are applied automatically after sign-in.
          </small>
        </form>
      </section>
    </div>
  )
}

function PageHeader({
  role,
  active,
  action,
}: {
  role: Role
  active: string
  action?: { text: string; onClick?: () => void }
}) {
  const isOverview = active === "Overview"
  return (
    <div className="page-header">
      <div>
        <div className="eyebrow">
          {role} portal <span>/</span> {active}
        </div>
        <h1>{isOverview ? roleMeta[role].greeting : active}</h1>
        <p>
          {isOverview
            ? roleMeta[role].sub
            : `Manage and review ${active.toLowerCase()} with clear, role-aware controls.`}
        </p>
      </div>
      {action && (
        <Button icon="plus" onClick={action.onClick}>
          {action.text}
        </Button>
      )}
    </div>
  )
}

function StatCard({
  label,
  value,
  delta,
  icon,
  tone,
}: {
  label: string
  value: string
  delta: string
  icon: IconName
  tone: string
}) {
  return (
    <Card className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon name={icon} />
      </div>
      <div className="stat-copy">
        <span>{label}</span>
        <strong>{value}</strong>
        <small>
          <b>↑ {delta}</b> from last term
        </small>
      </div>
      <button className="more-btn">
        <Icon name="more" />
      </button>
    </Card>
  )
}

function AdminOverview({
  setActive,
  facultyCount,
}: {
  setActive: (v: string) => void
  facultyCount: number
}) {
  return (
    <>
      <PageHeader
        role="Admin"
        active="Overview"
        action={{ text: "Quick add" }}
      />
      <div className="stats-grid">
        <StatCard
          label="Total students"
          value="3,842"
          delta="8.2%"
          icon="people"
          tone="sage"
        />
        <StatCard
          label="Faculty members"
          value={`${facultyCount}`}
          delta="3.4%"
          icon="people"
          tone="rose"
        />
        <StatCard
          label="Active programs"
          value="24"
          delta="2 new"
          icon="book"
          tone="sand"
        />
        <StatCard
          label="Avg. attendance"
          value="87.4%"
          delta="1.8%"
          icon="calendar"
          tone="olive"
        />
      </div>
      <div className="dashboard-grid">
        <Card className="performance-card">
          <div className="card-head">
            <div>
              <h2>Academic performance</h2>
              <p>Average score across all departments</p>
            </div>
            <select aria-label="Performance time range">
              <option>Last 6 months</option>
              <option>This year</option>
            </select>
          </div>
          <div className="chart-summary">
            <strong>78.6%</strong>
            <Badge tone="success">↑ 4.2%</Badge>
            <span>vs previous period</span>
          </div>
          <div className="line-chart" aria-label="Performance trend chart">
            <div className="chart-y">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
            </div>
            <svg viewBox="0 0 600 190" preserveAspectRatio="none" role="img">
              <defs>
                <linearGradient id="area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0" stopColor="#9F9752" stopOpacity=".26" />
                  <stop offset="1" stopColor="#9F9752" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path
                className="area"
                d="M0,145 C50,140 72,126 110,132 S174,112 220,118 S291,70 330,92 S410,68 445,76 S530,43 600,55 L600,190 L0,190Z"
              />
              <path
                className="line"
                d="M0,145 C50,140 72,126 110,132 S174,112 220,118 S291,70 330,92 S410,68 445,76 S530,43 600,55"
              />
            </svg>
            <div className="chart-x">
              <span>Jan</span>
              <span>Feb</span>
              <span>Mar</span>
              <span>Apr</span>
              <span>May</span>
              <span>Jun</span>
            </div>
          </div>
        </Card>
        <Card className="attendance-card">
          <div className="card-head">
            <div>
              <h2>Attendance overview</h2>
              <p>Institution-wide this month</p>
            </div>
            <button className="more-btn">
              <Icon name="more" />
            </button>
          </div>
          <div className="donut-row">
            <div className="donut">
              <div>
                <strong>87%</strong>
                <span>Average</span>
              </div>
            </div>
            <div className="donut-legend">
              <span>
                <i className="moss-bg" />
                Present <b>87%</b>
              </span>
              <span>
                <i className="rose-bg" />
                Absent <b>8%</b>
              </span>
              <span>
                <i className="sand-bg" />
                On leave <b>5%</b>
              </span>
            </div>
          </div>
          <button className="text-link" onClick={() => setActive("Analytics")}>
            View detailed analytics <Icon name="arrow" size={15} />
          </button>
        </Card>
        <InsightCard />
        <Card className="activity-card">
          <div className="card-head">
            <div>
              <h2>Recent activity</h2>
              <p>Latest institutional updates</p>
            </div>
            <button className="text-link">View all</button>
          </div>
          {[
            [
              "Results published",
              "B.Tech CSE · Semester 5",
              "12 min ago",
              "report",
            ],
            [
              "Assignment created",
              "Database Management Systems",
              "48 min ago",
              "assignment",
            ],
            [
              "Attendance updated",
              "Mechanical Engineering · Section A",
              "2 hours ago",
              "calendar",
            ],
          ].map(([title, sub, time, icon]) => (
            <div className="activity-row" key={title}>
              <span className="activity-icon">
                <Icon name={icon as IconName} />
              </span>
              <div>
                <strong>{title}</strong>
                <p>{sub}</p>
              </div>
              <time>{time}</time>
            </div>
          ))}
        </Card>
      </div>
    </>
  )
}

function InsightCard() {
  return (
    <Card className="insight-card">
      <div className="ai-label">
        <Icon name="sparkle" />
        <span>AICOS INSIGHT</span>
        <Badge tone="rose">AI-assisted</Badge>
      </div>
      <div className="insight-body">
        <div>
          <h2>First-year attendance needs attention</h2>
          <p>
            Attendance in three first-year sections has declined by 6.4% over
            the last four weeks. Early outreach may reduce academic risk.
          </p>
          <div className="insight-meta">
            <span>
              <Icon name="chart" /> Based on attendance trends
            </span>
            <span>
              <Icon name="clock" /> Updated 10 min ago
            </span>
          </div>
        </div>
        <div className="risk-visual">
          <div>
            <strong>3</strong>
            <span>sections</span>
          </div>
        </div>
      </div>
      <div className="insight-actions">
        <Button variant="secondary">Review sections</Button>
        <Button variant="ghost">Why am I seeing this?</Button>
      </div>
    </Card>
  )
}

const facultyStats = [
  ["Assigned classes", "6", "2 today", "book", "sage"],
  ["Total students", "214", "Across 6 classes", "people", "sand"],
  ["Pending reviews", "18", "5 due today", "assignment", "rose"],
  ["Class attendance", "89%", "↑ 2.1% this month", "calendar", "olive"],
]

function FacultyOverview({ setActive }: { setActive: (v: string) => void }) {
  return (
    <>
      <PageHeader
        role="Faculty"
        active="Overview"
        action={{
          text: "Create assignment",
          onClick: () => setActive("Assignments"),
        }}
      />
      <div className="stats-grid">
        {facultyStats.map((s) => (
          <StatCard
            key={s[0]}
            label={s[0]}
            value={s[1]}
            delta={s[2]}
            icon={s[3] as IconName}
            tone={s[4]}
          />
        ))}
      </div>
      <div className="faculty-grid">
        <Card className="today-card">
          <div className="card-head">
            <div>
              <h2>Today’s schedule</h2>
              <p>Tuesday, 18 June</p>
            </div>
            <Badge tone="neutral">4 sessions</Badge>
          </div>
          {[
            [
              "09:00",
              "Data Structures",
              "CSE · Semester 3 · Section A",
              "Room 204",
            ],
            ["11:30", "Algorithms", "CSE · Semester 5 · Section B", "Lab 3"],
            [
              "14:00",
              "Data Structures",
              "CSE · Semester 3 · Section B",
              "Room 206",
            ],
          ].map((x, i) => (
            <div className="schedule-row" key={x[0]}>
              <div className="schedule-time">
                <strong>{x[0]}</strong>
                <span>{i === 0 ? "60 min" : "90 min"}</span>
              </div>
              <i className={i === 1 ? "rose-line" : ""} />
              <div>
                <strong>{x[1]}</strong>
                <p>{x[2]}</p>
                <span>{x[3]}</span>
              </div>
              <button className="icon-btn">
                <Icon name="chevron" />
              </button>
            </div>
          ))}
        </Card>
        <Card className="attention-card">
          <div className="card-head">
            <div>
              <h2>Needs your attention</h2>
              <p>Prioritized by due date</p>
            </div>
          </div>
          <div className="attention-item">
            <span className="attention-icon rose">
              <Icon name="assignment" />
            </span>
            <div>
              <strong>12 submissions to review</strong>
              <p>Graph Traversal assignment</p>
            </div>
            <Badge tone="rose">Due today</Badge>
          </div>
          <div className="attention-item">
            <span className="attention-icon olive">
              <Icon name="sparkle" />
            </span>
            <div>
              <strong>6 AI evaluations ready</strong>
              <p>Review before finalizing</p>
            </div>
            <Badge tone="moss">Review</Badge>
          </div>
          <div className="attention-item">
            <span className="attention-icon sand">
              <Icon name="warning" />
            </span>
            <div>
              <strong>8 low-attendance students</strong>
              <p>Below 75% threshold</p>
            </div>
            <Badge tone="warning">Monitor</Badge>
          </div>
        </Card>
        <Card className="class-performance">
          <div className="card-head">
            <div>
              <h2>Class performance</h2>
              <p>Average scores by class</p>
            </div>
            <select>
              <option>All subjects</option>
            </select>
          </div>
          {[
            ["CSE 3A · Data Structures", 84, "84%"],
            ["CSE 5B · Algorithms", 77, "77%"],
            ["CSE 3B · Data Structures", 72, "72%"],
            ["CSE 5A · Algorithms", 68, "68%"],
          ].map((x, i) => (
            <div className="metric-row" key={x[0]}>
              <span>{x[0]}</span>
              <Progress
                value={x[1] as number}
                tone={i > 2 ? "rose" : "olive"}
              />
              <strong>{x[2]}</strong>
            </div>
          ))}
        </Card>
        <Card className="weak-topic">
          <div className="ai-label">
            <Icon name="sparkle" />
            <span>CLASS INTELLIGENCE</span>
          </div>
          <h2>Recursion is a shared weak topic</h2>
          <p>
            38% of students across CSE 3A and 3B scored below the proficiency
            threshold.
          </p>
          <div className="recommendation">
            <strong>Recommended next step</strong>
            <span>
              Schedule a focused revision session with visual examples.
            </span>
          </div>
          <Button variant="secondary">View evidence</Button>
        </Card>
      </div>
    </>
  )
}

function StudentOverview({ setActive }: { setActive: (v: string) => void }) {
  return (
    <>
      <PageHeader role="Student" active="Overview" />
      <div className="student-summary">
        <Card className="semester-card">
          <span>Current semester</span>
          <strong>{studentAcademicProfile.semester}</strong>
          <small>
            {studentAcademicProfile.degree} ·{" "}
            {studentAcademicProfile.departmentCode} ·{" "}
            {studentAcademicProfile.session}
          </small>
          <div>
            <span>CGPA</span>
            <b>8.42</b>
            <Badge tone="success">↑ 0.18</Badge>
          </div>
        </Card>
        <Card className="ring-card">
          <div className="mini-ring attendance-ring">
            <strong>75%</strong>
          </div>
          <div>
            <span>Attendance</span>
            <strong>Monitor closely</strong>
            <small>Across recorded classes</small>
          </div>
        </Card>
        <Card className="ring-card">
          <div className="mini-ring progress-ring">
            <strong>{allocatedSubjects.length}</strong>
          </div>
          <div>
            <span>Enrolled subjects</span>
            <strong>{studentAcademicProfile.academicYear}</strong>
            <small>Curriculum allocated</small>
          </div>
        </Card>
        <Card className="deadline-card">
          <span>Next deadline</span>
          <strong>Cloud Architecture</strong>
          <small>Cloud Computing · Tomorrow, 11:59 PM</small>
          <Button variant="outline">View assignment</Button>
        </Card>
      </div>
      <div className="student-grid">
        <Card className="subjects-card">
          <div className="card-head">
            <div>
              <h2>My subjects</h2>
              <p>Your progress this semester</p>
            </div>
            <button
              className="text-link"
              onClick={() => setActive("My subjects")}
            >
              View all
            </button>
          </div>
          {allocatedSubjects.slice(0, 3).map((subject, i) => (
            <div className="subject-row" key={subject.code}>
              <span className={`subject-monogram subject-${i}`}>
                {subject.name.slice(0, 2).toUpperCase()}
              </span>
              <div>
                <strong>{subject.name}</strong>
                <small>
                  {subject.code} · {subject.faculty}
                </small>
              </div>
              <div className="subject-metric">
                <span>
                  Credits <b>{subject.credits}</b>
                </span>
                <Progress
                  value={subject.attendance}
                  tone={subject.attendance < 75 ? "rose" : "olive"}
                />
              </div>
              <div className="subject-attendance">
                <span>Attendance</span>
                <Badge tone={subject.attendance < 75 ? "warning" : "success"}>
                  {subject.attendance}%
                </Badge>
              </div>
              <button className="icon-btn">
                <Icon name="chevron" />
              </button>
            </div>
          ))}
        </Card>
        <Card className="upcoming-card">
          <div className="card-head">
            <div>
              <h2>Coming up</h2>
              <p>Deadlines and examinations</p>
            </div>
          </div>
          {[
            ["TOMORROW", "Graph Traversal", "Assignment · CS301", "rose"],
            ["21 JUN", "Database normalization", "Quiz · CS305", "olive"],
            ["24 JUN", "Computer Networks", "Mid-semester exam", "sand"],
          ].map((x) => (
            <div className="upcoming-row" key={x[1]}>
              <span className={`date-tile ${x[3]}`}>{x[0]}</span>
              <div>
                <strong>{x[1]}</strong>
                <small>{x[2]}</small>
              </div>
              <Icon name="chevron" />
            </div>
          ))}
        </Card>
        <Card className="learning-insight">
          <div className="ai-label">
            <Icon name="sparkle" />
            <span>YOUR LEARNING INSIGHT</span>
            <Badge tone="rose">AI-assisted</Badge>
          </div>
          <div className="learning-content">
            <div>
              <h2>Focus on Computer Networks this week</h2>
              <p>
                Your scores in subnetting and routing are below your semester
                average. A focused 3-day review could help before the
                mid-semester exam.
              </p>
              <div className="topic-pills">
                <span>Subnetting</span>
                <span>Routing protocols</span>
                <span>OSI model</span>
              </div>
              <Button icon="play" onClick={() => setActive("AI study plan")}>
                Build a study plan
              </Button>
            </div>
            <div className="readiness">
              <div className="mini-ring rose-ring">
                <strong>68%</strong>
              </div>
              <span>Current proficiency</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  )
}

function ProfileField({
  label,
  value,
  editable = false,
  editing = false,
  onChange,
}: {
  label: string
  value: string
  editable?: boolean
  editing?: boolean
  onChange?: (value: string) => void
}) {
  return (
    <label className={`profile-field ${!editable ? "managed" : ""}`}>
      <span>
        {label}
        {!editable && <small>Managed by your institution</small>}
      </span>
      {editing && editable ? (
        <input
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
        />
      ) : (
        <strong>{value}</strong>
      )}
    </label>
  )
}

function ProfilePage({
  role,
  initialEdit = false,
}: {
  role: Role
  initialEdit?: boolean
}) {
  const [editing, setEditing] = useState(initialEdit)
  const [saved, setSaved] = useState(false)
  const [photo, setPhoto] = useState<string | null>(null)
  const [email, setEmail] = useState(
    role === "Student"
      ? studentAcademicProfile.email
      : role === "Faculty"
        ? "maya.sen@aicos.edu"
        : "ananya.rao@aicos.edu",
  )
  const [phone, setPhone] = useState(
    role === "Student"
      ? studentAcademicProfile.phone
      : role === "Faculty"
        ? "+91 98450 22147"
        : "+91 98451 78002",
  )
  const [contactAddress, setContactAddress] = useState(
    role === "Student"
      ? "Bengaluru, Karnataka"
      : "AICOS Institute Campus, Bengaluru",
  )
  const profile =
    role === "Student"
      ? {
          name: studentAcademicProfile.name,
          id: studentAcademicProfile.studentId,
          email: studentAcademicProfile.email,
          initials: "AN",
          title: `${studentAcademicProfile.degree} · ${studentAcademicProfile.program}`,
          status: "Active",
        }
      : role === "Faculty"
        ? {
            name: "Prof. Maya Sen",
            id: "FAC-CSE-0142",
            email: "maya.sen@aicos.edu",
            initials: "MS",
            title: "Associate Professor · Computer Science",
            status: "Active",
          }
        : {
            name: "Dr. Ananya Rao",
            id: "ADM-0018",
            email: "ananya.rao@aicos.edu",
            initials: "AR",
            title: "Academic Registrar · Institution Administration",
            status: "Active",
          }
  const save = () => {
    setEditing(false)
    setSaved(true)
    window.setTimeout(() => setSaved(false), 2400)
  }
  return (
    <div className="profile-page">
      <div className="profile-breadcrumb">
        {role} Dashboard <span>/</span> Profile
      </div>
      <Card className="profile-hero">
        <div className="profile-avatar-large">
          {photo ? (
            <img src={photo} alt={`${profile.name} profile`} />
          ) : (
            profile.initials
          )}
          {editing && (
            <label
              className="photo-edit-control"
              aria-label="Change profile photo"
            >
              <Icon name="plus" size={14} />
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0]
                  if (file) setPhoto(URL.createObjectURL(file))
                }}
              />
            </label>
          )}
        </div>
        <div className="profile-identity">
          <div>
            <h1>{profile.name}</h1>
            <Badge tone="success">
              <Icon name="check" size={11} /> {profile.status}
            </Badge>
          </div>
          <p>{profile.title}</p>
          <span>
            {profile.id} · {email}
          </span>
        </div>
        <div className="profile-actions">
          {editing ? (
            <>
              <Button variant="outline" onClick={() => setEditing(false)}>
                Cancel
              </Button>
              <Button icon="check" onClick={save}>
                Save changes
              </Button>
            </>
          ) : (
            <Button icon="assignment" onClick={() => setEditing(true)}>
              Edit profile
            </Button>
          )}
        </div>
      </Card>
      {saved && (
        <div className="profile-success">
          <Icon name="check" />
          <span>
            <strong>Profile successfully updated</strong>Your permitted contact
            details have been saved.
          </span>
        </div>
      )}
      <div className="profile-grid">
        <Card className="profile-section">
          <div className="section-title">
            <span className="section-title-icon">
              <Icon name="people" />
            </span>
            <div>
              <h2>Personal information</h2>
              <p>Your identity and contact details</p>
            </div>
          </div>
          <div className="profile-fields">
            <ProfileField label="Full name" value={profile.name} />
            <ProfileField
              label={
                role === "Student"
                  ? "USN / Student ID"
                  : role === "Faculty"
                    ? "Faculty ID"
                    : "Admin ID"
              }
              value={profile.id}
            />
            <ProfileField
              label="Email address"
              value={email}
              editable
              editing={editing}
              onChange={setEmail}
            />
            <ProfileField
              label="Phone number"
              value={phone}
              editable
              editing={editing}
              onChange={setPhone}
            />
            <ProfileField
              label="Contact address"
              value={contactAddress}
              editable
              editing={editing}
              onChange={setContactAddress}
            />
            {role === "Student" && (
              <ProfileField
                label="Date of birth"
                value={studentAcademicProfile.dateOfBirth}
              />
            )}
            <ProfileField label="Account status" value="Active" />
          </div>
        </Card>
        {role === "Student" ? (
          <Card className="profile-section academic-profile-section">
            <div className="section-title">
              <span className="section-title-icon sage">
                <Icon name="book" />
              </span>
              <div>
                <h2>Academic information</h2>
                <p>Official institutional record</p>
              </div>
              <Badge tone="moss">Institution managed</Badge>
            </div>
            <div className="academic-summary-card">
              <div>
                <span>Current academic context</span>
                <h3>
                  {studentAcademicProfile.academicYear} ·{" "}
                  {studentAcademicProfile.semester}
                </h3>
                <p>{studentAcademicProfile.session} academic session</p>
              </div>
              <div className="graduation-estimate">
                <span>Expected graduation</span>
                <strong>{studentAcademicProfile.graduationYear}</strong>
                <small>Estimated on successful completion</small>
              </div>
            </div>
            <div className="profile-fields academic-fields">
              <ProfileField
                label="Department"
                value={studentAcademicProfile.department}
              />
              <ProfileField
                label="Department code"
                value={studentAcademicProfile.departmentCode}
              />
              <ProfileField
                label="Degree / Program"
                value={`${studentAcademicProfile.degree} · ${studentAcademicProfile.program}`}
              />
              <ProfileField
                label="Admission year"
                value={`${studentAcademicProfile.admissionYear}`}
              />
              <ProfileField
                label="Course duration"
                value={`${studentAcademicProfile.duration} years · 8 semesters`}
              />
              <ProfileField
                label="Current semester"
                value={studentAcademicProfile.semester}
              />
              <ProfileField
                label="Section"
                value={studentAcademicProfile.section}
              />
              <ProfileField
                label="Enrollment status"
                value={studentAcademicProfile.enrollmentStatus}
              />
            </div>
            <div className="managed-note">
              <Icon name="warning" />
              <span>
                <strong>Managed by your institution</strong>Academic year and
                semester use the approved academic calendar, promotion records,
                and authorized semester assignment. Contact Academic Records if
                this information is incorrect.
              </span>
            </div>
          </Card>
        ) : role === "Faculty" ? (
          <Card className="profile-section academic-profile-section">
            <div className="section-title">
              <span className="section-title-icon sage">
                <Icon name="book" />
              </span>
              <div>
                <h2>Professional & teaching information</h2>
                <p>Institution-managed faculty record</p>
              </div>
              <Badge tone="moss">Institution managed</Badge>
            </div>
            <div className="profile-fields">
              <ProfileField label="Designation" value="Associate Professor" />
              <ProfileField
                label="Department"
                value="Computer Science and Design Engineering"
              />
              <ProfileField
                label="Qualification"
                value="Ph.D. in Computer Science"
              />
              <ProfileField label="Joining date" value="12 July 2018" />
              <ProfileField
                label="Specialization"
                value="Machine Learning, Algorithms"
              />
              <ProfileField
                label="Employment status"
                value="Full-time · Active"
              />
            </div>
            <div className="teaching-assignment-list">
              <h3>Current teaching assignments</h3>
              {[
                [
                  "Machine Learning",
                  "BCS701",
                  "Semester 7 · Section A",
                  "48 students",
                ],
                [
                  "Cloud Computing",
                  "BCS703",
                  "Semester 7 · Section A",
                  "48 students",
                ],
                [
                  "Algorithms",
                  "BCS503",
                  "Semester 5 · Section B",
                  "52 students",
                ],
              ].map((item) => (
                <div key={item[1]}>
                  <span className="assignment-course-icon">
                    <Icon name="book" />
                  </span>
                  <span>
                    <strong>{item[0]}</strong>
                    <small>
                      {item[1]} · {item[2]}
                    </small>
                  </span>
                  <Button variant="ghost">View roster · {item[3]}</Button>
                </div>
              ))}
            </div>
          </Card>
        ) : (
          <Card className="profile-section academic-profile-section">
            <div className="section-title">
              <span className="section-title-icon sage">
                <Icon name="settings" />
              </span>
              <div>
                <h2>Administrative access</h2>
                <p>Authorized institutional responsibilities</p>
              </div>
            </div>
            <div className="profile-fields">
              <ProfileField label="Designation" value="Academic Registrar" />
              <ProfileField
                label="Administrative role"
                value="Academic Operations Administrator"
              />
              <ProfileField
                label="Institution"
                value="AICOS Institute of Technology"
              />
              <ProfileField
                label="Department"
                value="Office of Academic Affairs"
              />
              <ProfileField
                label="Access level"
                value="Curriculum & Enrollment Management"
              />
              <ProfileField label="Account created" value="04 June 2021" />
            </div>
            <div className="admin-access-card">
              <Icon name="settings" />
              <div>
                <strong>Academic Configuration access</strong>
                <p>
                  You can manage departments, programs, curricula, academic
                  assignments, and progression records. All changes are retained
                  in the audit history.
                </p>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  )
}

function MyAllocatedSubjects() {
  const [selected, setSelected] =
    useState<typeof allocatedSubjects[number] | null>(null)
  return (
    <div className="allocated-page">
      <div className="page-header">
        <div>
          <div className="eyebrow">
            Student portal <span>/</span> My subjects
          </div>
          <h1>My Subjects</h1>
          <p>
            Subjects allocated from your official curriculum and enrollment
            record.
          </p>
        </div>
        <Badge tone="moss">{allocatedSubjects.length} enrolled subjects</Badge>
      </div>
      <Card className="allocation-context">
        <div>
          <span>Program</span>
          <strong>
            {studentAcademicProfile.degree} · {studentAcademicProfile.program}
          </strong>
        </div>
        <div>
          <span>Academic context</span>
          <strong>
            {studentAcademicProfile.academicYear} ·{" "}
            {studentAcademicProfile.semester}
          </strong>
        </div>
        <div>
          <span>Curriculum</span>
          <strong>{studentAcademicProfile.curriculum}</strong>
        </div>
        <div>
          <span>Section</span>
          <strong>{studentAcademicProfile.section}</strong>
        </div>
      </Card>
      <div className="allocated-grid">
        {allocatedSubjects.map((subject, index) => (
          <Card className="allocated-subject-card" key={subject.code}>
            <div className="allocated-card-head">
              <span className={`allocated-icon subject-${index % 3}`}>
                <Icon name="book" />
              </span>
              <div>
                <Badge tone={subject.type === "Core" ? "moss" : "neutral"}>
                  {subject.type}
                </Badge>
                <button onClick={() => setSelected(subject)}>
                  <Icon name="chevron" />
                </button>
              </div>
            </div>
            <h2>{subject.name}</h2>
            <p>
              {subject.code} · {studentAcademicProfile.semester} ·{" "}
              {subject.credits} credits
            </p>
            <div className="allocated-faculty">
              <Avatar
                initials={subject.faculty
                  .split(" ")
                  .slice(-2)
                  .map((part) => part[0])
                  .join("")}
                small
              />
              <span>
                <small>Faculty</small>
                <strong>{subject.faculty}</strong>
              </span>
            </div>
            <div className="allocated-metrics">
              <div>
                <span>Attendance</span>
                <strong className={subject.attendance < 75 ? "risk-text" : ""}>
                  {subject.attendance}%
                </strong>
                <Progress
                  value={subject.attendance}
                  tone={subject.attendance < 75 ? "rose" : "olive"}
                />
              </div>
              <div>
                <span>Assignments</span>
                <strong>{subject.assignment}</strong>
              </div>
              <div>
                <span>Results</span>
                <strong>{subject.result}</strong>
              </div>
            </div>
            <Button variant="outline" onClick={() => setSelected(subject)}>
              Open subject
            </Button>
          </Card>
        ))}
      </div>
      <div className="allocation-note">
        <Icon name="sparkle" />
        <span>
          <strong>Automatically allocated</strong>These subjects match your
          department, program, admission batch, curriculum version, official
          semester, section, and current enrollment eligibility.
        </span>
      </div>
      {selected && (
        <>
          <button
            className="drawer-backdrop"
            onClick={() => setSelected(null)}
            aria-label="Close subject"
          />
          <aside className="subject-detail-drawer">
            <div className="drawer-head">
              <div>
                <span className="drawer-kicker">ENROLLED SUBJECT</span>
                <h2>{selected.name}</h2>
                <p>
                  {selected.code} · {selected.credits} credits · {selected.type}
                </p>
              </div>
              <button className="icon-btn" onClick={() => setSelected(null)}>
                <Icon name="close" />
              </button>
            </div>
            <div className="subject-detail-banner">
              <Icon name="book" />
              <div>
                <strong>
                  {studentAcademicProfile.semester} · Section{" "}
                  {studentAcademicProfile.section}
                </strong>
                <span>
                  {studentAcademicProfile.session} ·{" "}
                  {studentAcademicProfile.curriculum}
                </span>
              </div>
            </div>
            <div className="profile-fields">
              <ProfileField label="Assigned faculty" value={selected.faculty} />
              <ProfileField
                label="Attendance"
                value={`${selected.attendance}%`}
              />
              <ProfileField
                label="Assignment status"
                value={selected.assignment}
              />
              <ProfileField
                label="Results status"
                value={
                  selected.result === "Published"
                    ? "Official result published"
                    : "No published result"
                }
              />
            </div>
            <div className="managed-note">
              <Icon name="check" />
              <span>
                <strong>Official enrollment</strong>This subject is linked to
                your authorized enrollment record. Historical records remain
                available after progression.
              </span>
            </div>
          </aside>
        </>
      )}
    </div>
  )
}

function AcademicConfiguration() {
  const [tab, setTab] = useState("Curriculum")
  const [previewed, setPreviewed] = useState(false)
  const [confirmed, setConfirmed] = useState(false)
  const tabs = [
    "Departments",
    "Programs",
    "Curriculum",
    "Student assignment",
    "Progression",
    "System states",
  ]
  return (
    <div className="academic-config-page">
      <PageHeader
        role="Admin"
        active="Academic Configuration"
        action={{ text: "Create new" }}
      />
      <div className="config-tabs">
        {tabs.map((item) => (
          <button
            className={tab === item ? "active" : ""}
            onClick={() => {
              setTab(item)
              setPreviewed(false)
              setConfirmed(false)
            }}
            key={item}
          >
            {item}
          </button>
        ))}
      </div>
      {tab === "Departments" && (
        <Card className="config-table-card">
          <div className="config-card-head">
            <div>
              <h2>Departments</h2>
              <p>Academic units and their active programs</p>
            </div>
            <Button icon="plus">Add department</Button>
          </div>
          <table>
            <thead>
              <tr>
                <th>Department</th>
                <th>Code</th>
                <th>Programs offered</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {[
                [
                  "Computer Science and Design Engineering",
                  "CSD",
                  "BE CSD · M.Tech CSE",
                  "Active",
                ],
                [
                  "Information Science and Engineering",
                  "ISE",
                  "BE ISE · M.Tech Data Science",
                  "Active",
                ],
                ["Electronics and Communication", "ECE", "BE ECE", "Active"],
              ].map((row) => (
                <tr key={row[1]}>
                  <td>
                    <strong>{row[0]}</strong>
                  </td>
                  <td>
                    <code>{row[1]}</code>
                  </td>
                  <td>{row[2]}</td>
                  <td>
                    <Badge tone="success">{row[3]}</Badge>
                  </td>
                  <td>
                    <button className="icon-btn">
                      <Icon name="more" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
      {tab === "Programs" && (
        <div className="program-grid">
          {[
            [
              "BE Computer Science and Design",
              "BE",
              "4 years",
              "8 semesters",
              "2023, 2024, 2025",
            ],
            [
              "M.Tech Data Science",
              "M.Tech",
              "2 years",
              "4 semesters",
              "2024, 2025",
            ],
            [
              "Integrated Architecture",
              "B.Arch",
              "5 years",
              "10 semesters",
              "2023, 2024, 2025",
            ],
          ].map((program) => (
            <Card className="program-card" key={program[0]}>
              <div>
                <Badge tone="moss">{program[1]}</Badge>
                <button className="icon-btn">
                  <Icon name="more" />
                </button>
              </div>
              <h2>{program[0]}</h2>
              <p>Computer Science and Design Engineering</p>
              <div className="program-facts">
                <span>
                  <small>Duration</small>
                  <strong>{program[2]}</strong>
                </span>
                <span>
                  <small>Structure</small>
                  <strong>{program[3]}</strong>
                </span>
                <span>
                  <small>Admission batches</small>
                  <strong>{program[4]}</strong>
                </span>
              </div>
              <div className="program-foot">
                <Badge tone="success">Active</Badge>
                <Button variant="ghost">Manage program</Button>
              </div>
            </Card>
          ))}
        </div>
      )}
      {tab === "Curriculum" && (
        <div className="curriculum-layout">
          <Card className="curriculum-setup">
            <div className="config-card-head">
              <div>
                <h2>Curriculum selection</h2>
                <p>Choose the exact academic context</p>
              </div>
              <Badge tone="moss">Version controlled</Badge>
            </div>
            <div className="curriculum-selectors">
              <label>
                Degree program
                <select>
                  <option>BE · Computer Science and Design</option>
                </select>
              </label>
              <label>
                Admission batch
                <select>
                  <option>2023</option>
                  <option>2024</option>
                </select>
              </label>
              <label>
                Curriculum version
                <select>
                  <option>CSD-2023 · Version 2</option>
                </select>
              </label>
              <label>
                Academic year
                <select>
                  <option>Year 4</option>
                </select>
              </label>
              <label>
                Semester
                <select>
                  <option>Semester 7</option>
                </select>
              </label>
              <label>
                Section applicability
                <select>
                  <option>All sections</option>
                  <option>Section A</option>
                </select>
              </label>
            </div>
            <div className="config-notice">
              <Icon name="warning" />
              <span>
                <strong>Safeguarded configuration</strong>Changes apply only to
                eligible students matching this exact program, batch,
                curriculum, year, semester, and enrollment rule.
              </span>
            </div>
          </Card>
          <Card className="curriculum-subjects">
            <div className="config-card-head">
              <div>
                <h2>Curriculum subjects</h2>
                <p>5 subjects · 16 total credits</p>
              </div>
              <Button icon="plus">Add subject</Button>
            </div>
            {allocatedSubjects.map((subject) => (
              <div className="curriculum-row" key={subject.code}>
                <span className="assignment-course-icon">
                  <Icon name="book" />
                </span>
                <div>
                  <strong>{subject.name}</strong>
                  <small>
                    {subject.code} · {subject.type}
                  </small>
                </div>
                <span>
                  <small>Credits</small>
                  <strong>{subject.credits}</strong>
                </span>
                <Badge tone={subject.type === "Core" ? "moss" : "neutral"}>
                  {subject.type}
                </Badge>
                <button className="icon-btn">
                  <Icon name="more" />
                </button>
              </div>
            ))}
            <div className="curriculum-actions">
              <Button
                variant="outline"
                onClick={() => setPreviewed(true)}
                icon="eye"
              >
                Preview allocation
              </Button>
              <Button>Save curriculum</Button>
            </div>
          </Card>
          {previewed && (
            <Card className="allocation-preview">
              <div>
                <Icon name="sparkle" />
                <span>
                  <strong>Allocation preview ready</strong>48 eligible students
                  in Semester 7, Section A will receive 5 subjects. Historical
                  enrollments are unaffected.
                </span>
              </div>
              <Button variant="secondary">Review eligible students</Button>
            </Card>
          )}
        </div>
      )}
      {tab === "Student assignment" && (
        <div className="student-assignment-layout">
          <Card className="assignment-search-card">
            <div className="config-card-head">
              <div>
                <h2>Find student</h2>
                <p>Search by full name or official USN</p>
              </div>
            </div>
            <div className="field-search">
              <Icon name="search" />
              <input defaultValue={studentAcademicProfile.studentId} />
            </div>
            <div className="student-match">
              <Avatar initials="AN" />
              <div>
                <strong>{studentAcademicProfile.name}</strong>
                <span>
                  {studentAcademicProfile.studentId} ·{" "}
                  {studentAcademicProfile.email}
                </span>
              </div>
              <Badge tone="success">Unique match</Badge>
            </div>
          </Card>
          <Card className="official-assignment-card">
            <div className="config-card-head">
              <div>
                <h2>Official academic assignment</h2>
                <p>Institution-managed enrollment context</p>
              </div>
              <Badge tone="warning">Review required</Badge>
            </div>
            <div className="curriculum-selectors">
              <label>
                Department
                <select>
                  <option>{studentAcademicProfile.department}</option>
                </select>
              </label>
              <label>
                Degree program
                <select>
                  <option>
                    {studentAcademicProfile.degree} ·{" "}
                    {studentAcademicProfile.program}
                  </option>
                </select>
              </label>
              <label>
                Admission batch
                <select>
                  <option>{studentAcademicProfile.admissionYear}</option>
                </select>
              </label>
              <label>
                Official semester
                <select>
                  <option>{studentAcademicProfile.semester}</option>
                </select>
              </label>
              <label>
                Section
                <select>
                  <option>Section {studentAcademicProfile.section}</option>
                </select>
              </label>
              <label>
                Curriculum version
                <select>
                  <option>{studentAcademicProfile.curriculum}</option>
                </select>
              </label>
            </div>
            <div className="validation-success">
              <Icon name="check" />
              <span>
                <strong>Curriculum match verified</strong>The selected
                curriculum matches the student’s department, program, batch, and
                semester.
              </span>
            </div>
            <div className="assignment-review">
              <span>Curriculum-derived allocation</span>
              <strong>{allocatedSubjects.length} subjects · 16 credits</strong>
              <button onClick={() => setPreviewed(!previewed)}>
                Preview subjects <Icon name="chevron" size={14} />
              </button>
            </div>
            {previewed && (
              <div className="mini-subject-list">
                {allocatedSubjects.map((subject) => (
                  <span key={subject.code}>
                    <Icon name="check" size={13} />
                    {subject.code} · {subject.name}
                    <b>{subject.credits} cr</b>
                  </span>
                ))}
              </div>
            )}
            <div className="curriculum-actions">
              <Button variant="outline">Save as pending review</Button>
              <Button onClick={() => setConfirmed(true)}>
                Confirm academic assignment
              </Button>
            </div>
          </Card>
          {confirmed && (
            <div className="allocation-confirmed">
              <Icon name="check" />
              <span>
                <strong>Subjects successfully allocated</strong>
                {studentAcademicProfile.name} now has {allocatedSubjects.length}{" "}
                eligible Semester 7 subjects. Historical records were preserved.
              </span>
            </div>
          )}
        </div>
      )}
      {tab === "Progression" && (
        <div className="progression-layout">
          <Card className="progression-steps">
            <div className="config-card-head">
              <div>
                <h2>Semester progression</h2>
                <p>2026–2027 academic session</p>
              </div>
              <Badge tone="warning">Pending approval</Badge>
            </div>
            {[
              ["1", "Academic calendar configured", "Completed"],
              ["2", "Promotion records verified", "Completed"],
              ["3", "Eligibility exceptions reviewed", "In review"],
              ["4", "Subject allocation preview", "Pending"],
              ["5", "Authorize progression", "Pending"],
            ].map((step, index) => (
              <div
                className={`progression-step ${index < 2 ? "complete" : ""}`}
                key={step[0]}
              >
                <span>
                  {index < 2 ? <Icon name="check" size={14} /> : step[0]}
                </span>
                <div>
                  <strong>{step[1]}</strong>
                  <small>{step[2]}</small>
                </div>
                {index === 2 && (
                  <Button variant="outline">Review 7 exceptions</Button>
                )}
              </div>
            ))}
          </Card>
          <Card className="progression-preview">
            <div className="ai-label">
              <Icon name="sparkle" />
              <span>PROPOSED ALLOCATION</span>
            </div>
            <h2>Preview before applying changes</h2>
            <p>
              Progression is based on approved promotion records—not date alone.
            </p>
            <div className="progression-numbers">
              <div>
                <strong>184</strong>
                <span>Eligible students</span>
              </div>
              <div>
                <strong>7</strong>
                <span>Require review</span>
              </div>
              <div>
                <strong>5</strong>
                <span>Curricula matched</span>
              </div>
            </div>
            <div className="config-notice">
              <Icon name="warning" />
              <span>
                Students with deferrals, repeats, backlogs, or approved
                exceptions remain in review until an authorized decision is
                recorded.
              </span>
            </div>
            <Button icon="eye">Generate progression preview</Button>
          </Card>
        </div>
      )}
      {tab === "System states" && (
        <div className="system-states-grid">
          {[
            [
              "book",
              "sand",
              "No academic program assigned",
              "This student does not yet have an official program or admission batch.",
              "Assign academic program",
            ],
            [
              "assignment",
              "sand",
              "No subjects allocated",
              "No eligible subjects are available for the student’s current enrollment record.",
              "Review enrollment",
            ],
            [
              "warning",
              "rose",
              "Curriculum not configured",
              "Semester 7 has no approved curriculum for the selected program and admission batch.",
              "Configure curriculum",
            ],
            [
              "clock",
              "olive",
              "Enrollment requires review",
              "An elective exception or repeated subject requires an authorized decision.",
              "Open review queue",
            ],
            [
              "people",
              "rose",
              "Possible duplicate student",
              "Another active record uses the same institutional email or identity reference.",
              "Compare records",
            ],
            [
              "warning",
              "rose",
              "Profile failed to load",
              "The institutional profile service could not be reached. No fallback academic data is shown.",
              "Retry",
            ],
          ].map((state) => (
            <Card className="system-state-card" key={state[2]}>
              <span className={`state-icon ${state[1]}`}>
                <Icon name={state[0] as IconName} />
              </span>
              <h2>{state[2]}</h2>
              <p>{state[3]}</p>
              <Button variant="outline">{state[4]}</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

const facultyDepartments = [
  "Computer Science and Design Engineering",
  "Information Technology",
  "Mechanical Engineering",
  "Electronics and Communication",
]

const facultyDesignations = [
  "Professor",
  "Associate Professor",
  "Assistant Professor",
  "Lecturer",
  "Teaching Assistant",
  "Other",
]

const assignableFacultySubjects = [
  "Machine Learning (BCS701)",
  "Deep Learning (BCS714A)",
  "Computer Networks (BCS702)",
  "Cloud Computing (BCS703)",
  "Project Management (BCS704)",
]

const assignableFacultyClasses = [
  "Semester 7 · Section A",
  "Semester 7 · Section B",
  "Semester 5 · Section A",
  "Semester 5 · Section B",
]

function FacultyFormPanel({
  faculty,
  records,
  onClose,
  onSave,
}: {
  faculty?: FacultyRecord
  records: FacultyRecord[]
  onClose: () => void
  onSave: (faculty: FacultyRecord) => void
}) {
  const [form, setForm] = useState<FacultyRecord>(
    faculty ?? {
      id: "",
      name: "",
      email: "",
      phone: "",
      department: "",
      designation: "",
      qualification: "",
      specialization: "",
      status: "Active",
      subjects: [],
      classes: [],
    },
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const update = (field: keyof FacultyRecord, value: string | string[]) =>
    setForm((current) => ({ ...current, [field]: value }))
  const toggleListValue = (field: "subjects" | "classes", value: string) => {
    const values = form[field]
    update(
      field,
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    )
  }
  const submit = (event: React.FormEvent) => {
    event.preventDefault()
    const nextErrors: Record<string, string> = {}
    if (!form.name.trim()) nextErrors.name = "Full name is required."
    if (!form.email.trim()) nextErrors.email = "Email address is required."
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      nextErrors.email = "Enter a valid institutional email address."
    if (!form.id.trim()) nextErrors.id = "Faculty ID is required."
    else if (
      records.some(
        (record) =>
          record.id.toLowerCase() === form.id.trim().toLowerCase() &&
          record.id !== faculty?.id,
      )
    )
      nextErrors.id = "This Faculty ID already exists."
    if (!form.department) nextErrors.department = "Select a department."
    if (!form.designation) nextErrors.designation = "Select a designation."
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length) return
    onSave({
      ...form,
      id: form.id.trim().toUpperCase(),
      name: form.name.trim(),
      email: form.email.trim(),
    })
  }
  return (
    <>
      <button
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close faculty form"
      />
      <aside className="faculty-form-panel">
        <form onSubmit={submit}>
          <div className="faculty-panel-head">
            <div>
              <span className="drawer-kicker">
                {faculty ? "EDIT FACULTY" : "FACULTY REGISTRATION"}
              </span>
              <h2>
                {faculty ? "Update faculty member" : "Add faculty member"}
              </h2>
              <p>
                {faculty
                  ? "Update permitted profile and professional information."
                  : "Create an institutional faculty account."}
              </p>
            </div>
            <button type="button" className="icon-btn" onClick={onClose}>
              <Icon name="close" />
            </button>
          </div>
          <div className="faculty-form-body">
            <div className="faculty-form-section">
              <div className="faculty-form-title">
                <span>
                  <Icon name="people" />
                </span>
                <div>
                  <h3>Personal information</h3>
                  <p>Identity and contact details</p>
                </div>
              </div>
              <div className="faculty-form-grid">
                <label className={errors.name ? "field-error" : ""}>
                  Full name <b>*</b>
                  <input
                    value={form.name}
                    onChange={(event) => update("name", event.target.value)}
                    placeholder="e.g. Dr. Asha Menon"
                  />
                  {errors.name && <small>{errors.name}</small>}
                </label>
                <label className={errors.email ? "field-error" : ""}>
                  Email address <b>*</b>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(event) => update("email", event.target.value)}
                    placeholder="name@aicos.edu"
                  />
                  {errors.email && <small>{errors.email}</small>}
                </label>
                <label>
                  Phone number
                  <input
                    value={form.phone}
                    onChange={(event) => update("phone", event.target.value)}
                    placeholder="+91 98765 43210"
                  />
                </label>
                <label>
                  Profile photo
                  <span className="faculty-file-input">
                    <Icon name="plus" size={14} />
                    {form.photo || "Choose optional image"}
                    <input
                      type="file"
                      accept="image/png,image/jpeg,image/webp"
                      onChange={(event) =>
                        update("photo", event.target.files?.[0]?.name ?? "")
                      }
                    />
                  </span>
                </label>
              </div>
            </div>
            <div className="faculty-form-section">
              <div className="faculty-form-title">
                <span className="sage">
                  <Icon name="book" />
                </span>
                <div>
                  <h3>Professional information</h3>
                  <p>Official institutional record</p>
                </div>
              </div>
              <div className="faculty-form-grid">
                <label className={errors.id ? "field-error" : ""}>
                  Faculty ID <b>*</b>
                  <input
                    value={form.id}
                    disabled={Boolean(faculty)}
                    onChange={(event) => update("id", event.target.value)}
                    placeholder="FAC006"
                  />
                  {errors.id && <small>{errors.id}</small>}
                </label>
                <label className={errors.department ? "field-error" : ""}>
                  Department <b>*</b>
                  <select
                    value={form.department}
                    onChange={(event) =>
                      update("department", event.target.value)
                    }
                  >
                    <option value="">Select department</option>
                    {facultyDepartments.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  {errors.department && <small>{errors.department}</small>}
                </label>
                <label className={errors.designation ? "field-error" : ""}>
                  Designation <b>*</b>
                  <select
                    value={form.designation}
                    onChange={(event) =>
                      update("designation", event.target.value)
                    }
                  >
                    <option value="">Select designation</option>
                    {facultyDesignations.map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                  {errors.designation && <small>{errors.designation}</small>}
                </label>
                <label>
                  Qualification
                  <input
                    value={form.qualification}
                    onChange={(event) =>
                      update("qualification", event.target.value)
                    }
                    placeholder="e.g. Ph.D. in Computer Science"
                  />
                </label>
                <label className="full-field">
                  Specialization
                  <input
                    value={form.specialization}
                    onChange={(event) =>
                      update("specialization", event.target.value)
                    }
                    placeholder="e.g. Machine Learning, Data Systems"
                  />
                </label>
              </div>
            </div>
            <div className="faculty-form-section">
              <div className="faculty-form-title">
                <span className="rose">
                  <Icon name="settings" />
                </span>
                <div>
                  <h3>Account information</h3>
                  <p>Status and optional teaching allocation</p>
                </div>
              </div>
              <label className="faculty-status-field">
                Account status
                <div>
                  {(["Active", "Inactive"] as const).map((item) => (
                    <button
                      type="button"
                      className={form.status === item ? "active" : ""}
                      onClick={() => update("status", item)}
                      key={item}
                    >
                      <i /> {item}
                    </button>
                  ))}
                </div>
              </label>
              <div className="faculty-check-groups">
                <div>
                  <strong>
                    Assigned subjects <small>Optional</small>
                  </strong>
                  {assignableFacultySubjects.map((item) => (
                    <label key={item}>
                      <input
                        type="checkbox"
                        checked={form.subjects.includes(item)}
                        onChange={() => toggleListValue("subjects", item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
                <div>
                  <strong>
                    Assigned classes or sections <small>Optional</small>
                  </strong>
                  {assignableFacultyClasses.map((item) => (
                    <label key={item}>
                      <input
                        type="checkbox"
                        checked={form.classes.includes(item)}
                        onChange={() => toggleListValue("classes", item)}
                      />
                      {item}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="faculty-form-actions">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <button className="btn btn-primary" type="submit">
              <Icon name="check" size={16} />
              {faculty ? "Save changes" : "Save faculty"}
            </button>
          </div>
        </form>
      </aside>
    </>
  )
}

function FacultyProfilePanel({
  faculty,
  onClose,
}: {
  faculty: FacultyRecord
  onClose: () => void
}) {
  const initials = faculty.name
    .replace(/^(Dr\.|Prof\.)\s*/, "")
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
  return (
    <>
      <button
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close profile"
      />
      <aside className="faculty-profile-panel">
        <div className="drawer-head">
          <div>
            <span className="drawer-kicker">FACULTY PROFILE</span>
            <h2>{faculty.name}</h2>
            <p>
              {faculty.id} · {faculty.designation}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="faculty-profile-identity">
          <Avatar initials={initials} />
          <div>
            <strong>{faculty.department}</strong>
            <span>
              {faculty.email} · {faculty.phone || "No phone recorded"}
            </span>
          </div>
          <Badge tone={faculty.status === "Active" ? "success" : "neutral"}>
            {faculty.status}
          </Badge>
        </div>
        <div className="profile-fields">
          <ProfileField label="Faculty ID" value={faculty.id} />
          <ProfileField label="Designation" value={faculty.designation} />
          <ProfileField
            label="Qualification"
            value={faculty.qualification || "Not recorded"}
          />
          <ProfileField
            label="Specialization"
            value={faculty.specialization || "Not recorded"}
          />
        </div>
        <div className="faculty-profile-list">
          <h3>Assigned subjects</h3>
          {faculty.subjects.length ? (
            faculty.subjects.map((item) => (
              <span key={item}>
                <Icon name="book" />
                {item}
              </span>
            ))
          ) : (
            <p>No subjects currently assigned.</p>
          )}
          <h3>Assigned classes and sections</h3>
          {faculty.classes.length ? (
            faculty.classes.map((item) => (
              <span key={item}>
                <Icon name="people" />
                {item}
              </span>
            ))
          ) : (
            <p>No classes currently assigned.</p>
          )}
        </div>
        <div className="managed-note">
          <Icon name="warning" />
          <span>
            <strong>Institution-managed teaching record</strong>Assignments can
            only be changed by an authorized administrator and historical
            academic records are preserved.
          </span>
        </div>
      </aside>
    </>
  )
}

function FacultyAssignmentPanel({
  faculty,
  onClose,
  onSave,
}: {
  faculty: FacultyRecord
  onClose: () => void
  onSave: (faculty: FacultyRecord) => void
}) {
  const [subjects, setSubjects] = useState(faculty.subjects)
  const [classes, setClasses] = useState(faculty.classes)
  const toggle = (
    values: string[],
    value: string,
    setValues: (values: string[]) => void,
  ) =>
    setValues(
      values.includes(value)
        ? values.filter((item) => item !== value)
        : [...values, value],
    )
  return (
    <>
      <button
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close assignments"
      />
      <aside className="faculty-assignment-panel">
        <div className="drawer-head">
          <div>
            <span className="drawer-kicker">TEACHING ASSIGNMENTS</span>
            <h2>{faculty.name}</h2>
            <p>
              {faculty.id} · {faculty.department}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose}>
            <Icon name="close" />
          </button>
        </div>
        <div className="config-notice">
          <Icon name="warning" />
          <span>
            <strong>Curriculum-controlled assignments</strong>Only subjects and
            classes available in configured academic records can be selected.
          </span>
        </div>
        <div className="assignment-panel-section">
          <h3>Subjects</h3>
          <p>Assign or remove eligible curriculum subjects.</p>
          {assignableFacultySubjects.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={subjects.includes(item)}
                onChange={() => toggle(subjects, item, setSubjects)}
              />
              <span>
                <strong>{item.split(" (")[0]}</strong>
                <small>
                  {item.match(/\((.*?)\)/)?.[1]} · Semester 7 curriculum
                </small>
              </span>
            </label>
          ))}
        </div>
        <div className="assignment-panel-section">
          <h3>Classes and sections</h3>
          <p>Roster access follows these authorized assignments.</p>
          {assignableFacultyClasses.map((item) => (
            <label key={item}>
              <input
                type="checkbox"
                checked={classes.includes(item)}
                onChange={() => toggle(classes, item, setClasses)}
              />
              <span>
                <strong>{item}</strong>
                <small>Available academic record</small>
              </span>
            </label>
          ))}
        </div>
        <div className="faculty-form-actions">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave({ ...faculty, subjects, classes })}>
            Save assignments
          </Button>
        </div>
      </aside>
    </>
  )
}

function FacultyManagement({
  records,
  setRecords,
}: {
  records: FacultyRecord[]
  setRecords: React.Dispatch<React.SetStateAction<FacultyRecord[]>>
}) {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All departments")
  const [designation, setDesignation] = useState("All designations")
  const [status, setStatus] = useState("All statuses")
  const [sort, setSort] = useState("Faculty name")
  const [selected, setSelected] = useState<string[]>([])
  const [formFaculty, setFormFaculty] = useState<FacultyRecord | "new" | null>(
    null,
  )
  const [viewFaculty, setViewFaculty] = useState<FacultyRecord | null>(null)
  const [assignmentFaculty, setAssignmentFaculty] =
    useState<FacultyRecord | null>(null)
  const [confirmFaculty, setConfirmFaculty] = useState<FacultyRecord | null>(
    null,
  )
  const [menuId, setMenuId] = useState<string | null>(null)
  const [success, setSuccess] = useState("")
  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return records
      .filter(
        (record) =>
          (!term ||
            record.name.toLowerCase().includes(term) ||
            record.id.toLowerCase().includes(term)) &&
          (department === "All departments" ||
            record.department === department) &&
          (designation === "All designations" ||
            record.designation === designation) &&
          (status === "All statuses" || record.status === status),
      )
      .sort((a, b) =>
        sort === "Faculty ID"
          ? a.id.localeCompare(b.id)
          : a.name.localeCompare(b.name),
      )
  }, [records, search, department, designation, status, sort])
  const clearFilters = () => {
    setSearch("")
    setDepartment("All departments")
    setDesignation("All designations")
    setStatus("All statuses")
    setSort("Faculty name")
  }
  const notify = (message: string) => {
    setSuccess(message)
    window.setTimeout(() => setSuccess(""), 2600)
  }
  const saveFaculty = (record: FacultyRecord) => {
    const exists = records.some((item) => item.id === record.id)
    setRecords((current) =>
      exists
        ? current.map((item) => (item.id === record.id ? record : item))
        : [...current, record],
    )
    setFormFaculty(null)
    setAssignmentFaculty(null)
    notify(
      exists
        ? "Faculty member updated successfully."
        : "Faculty member added successfully.",
    )
  }
  const exportRecords = () => {
    const header = [
      "Faculty Name",
      "Faculty ID",
      "Department",
      "Designation",
      "Status",
    ]
    const rows = filtered.map((item) => [
      item.name,
      item.id,
      item.department,
      item.designation,
      item.status,
    ])
    const csv = [header, ...rows]
      .map((row) =>
        row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(","),
      )
      .join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }))
    const link = document.createElement("a")
    link.href = url
    link.download = "aicos-faculty-records.csv"
    link.click()
    URL.revokeObjectURL(url)
  }
  const allVisibleSelected =
    filtered.length > 0 && filtered.every((item) => selected.includes(item.id))
  return (
    <>
      <PageHeader
        role="Admin"
        active="Faculty Management"
        action={{ text: "Add faculty", onClick: () => setFormFaculty("new") }}
      />
      {success && (
        <div className="faculty-success-toast">
          <span>
            <Icon name="check" />
          </span>
          <strong>{success}</strong>
          <button onClick={() => setSuccess("")}>
            <Icon name="close" />
          </button>
        </div>
      )}
      <Card className="faculty-table-card">
        <div className="faculty-table-tools">
          <div className="field-search">
            <Icon name="search" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search faculty name or ID…"
            />
          </div>
          <select
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option>All departments</option>
            {facultyDepartments.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={designation}
            onChange={(event) => setDesignation(event.target.value)}
          >
            <option>All designations</option>
            {facultyDesignations.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <select
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option>Faculty name</option>
            <option>Faculty ID</option>
          </select>
          <button className="clear-filters" onClick={clearFilters}>
            Clear all
          </button>
          <span className="spacer" />
          <Button variant="ghost" icon="download" onClick={exportRecords}>
            Export
          </Button>
        </div>
        {selected.length > 0 && (
          <div className="faculty-selection-bar">
            <strong>{selected.length} selected</strong>
            <span>Bulk destructive actions are intentionally unavailable.</span>
            <button onClick={() => setSelected([])}>Clear selection</button>
          </div>
        )}
        {filtered.length ? (
          <div className="table-scroll">
            <table className="faculty-table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={allVisibleSelected}
                      onChange={() =>
                        setSelected(
                          allVisibleSelected
                            ? selected.filter(
                                (id) =>
                                  !filtered.some((item) => item.id === id),
                              )
                            : Array.from(
                                new Set([
                                  ...selected,
                                  ...filtered.map((item) => item.id),
                                ]),
                              ),
                        )
                      }
                    />
                  </th>
                  <th>Faculty Name</th>
                  <th>Faculty ID</th>
                  <th>Department</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((faculty) => {
                  const initials = faculty.name
                    .replace(/^(Dr\.|Prof\.)\s*/, "")
                    .split(" ")
                    .map((part) => part[0])
                    .slice(0, 2)
                    .join("")
                  return (
                    <tr key={faculty.id}>
                      <td>
                        <input
                          type="checkbox"
                          checked={selected.includes(faculty.id)}
                          onChange={() =>
                            setSelected((current) =>
                              current.includes(faculty.id)
                                ? current.filter((id) => id !== faculty.id)
                                : [...current, faculty.id],
                            )
                          }
                        />
                      </td>
                      <td>
                        <span className="person-cell">
                          <Avatar initials={initials} small />
                          <span>
                            <strong>{faculty.name}</strong>
                            <small>{faculty.email}</small>
                          </span>
                        </span>
                      </td>
                      <td>
                        <code>{faculty.id}</code>
                      </td>
                      <td>{faculty.department}</td>
                      <td>{faculty.designation}</td>
                      <td>
                        <Badge
                          tone={
                            faculty.status === "Active" ? "success" : "neutral"
                          }
                        >
                          {faculty.status}
                        </Badge>
                      </td>
                      <td className="faculty-action-cell">
                        <button
                          className="icon-btn"
                          onClick={() =>
                            setMenuId(menuId === faculty.id ? null : faculty.id)
                          }
                        >
                          <Icon name="more" />
                        </button>
                        {menuId === faculty.id && (
                          <div className="faculty-row-menu">
                            <button
                              onClick={() => {
                                setViewFaculty(faculty)
                                setMenuId(null)
                              }}
                            >
                              <Icon name="eye" />
                              View profile
                            </button>
                            <button
                              onClick={() => {
                                setFormFaculty(faculty)
                                setMenuId(null)
                              }}
                            >
                              <Icon name="assignment" />
                              Edit faculty
                            </button>
                            <button
                              onClick={() => {
                                setAssignmentFaculty(faculty)
                                setMenuId(null)
                              }}
                            >
                              <Icon name="book" />
                              Manage subject assignments
                            </button>
                            <button
                              onClick={() => {
                                setConfirmFaculty(faculty)
                                setMenuId(null)
                              }}
                            >
                              <Icon
                                name={
                                  faculty.status === "Active"
                                    ? "warning"
                                    : "check"
                                }
                              />
                              {faculty.status === "Active"
                                ? "Deactivate"
                                : "Activate"}
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="faculty-empty">
            <span>
              <Icon name="people" />
            </span>
            <h2>No faculty records found</h2>
            <p>Try a different name, Faculty ID, or filter combination.</p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
        <div className="pagination">
          <span>
            Showing {filtered.length} of {records.length} illustrative faculty
            records
          </span>
          <div>
            <Badge tone="neutral">Prototype data</Badge>
          </div>
        </div>
      </Card>
      {formFaculty && (
        <FacultyFormPanel
          faculty={formFaculty === "new" ? undefined : formFaculty}
          records={records}
          onClose={() => setFormFaculty(null)}
          onSave={saveFaculty}
        />
      )}
      {viewFaculty && (
        <FacultyProfilePanel
          faculty={viewFaculty}
          onClose={() => setViewFaculty(null)}
        />
      )}
      {assignmentFaculty && (
        <FacultyAssignmentPanel
          faculty={assignmentFaculty}
          onClose={() => setAssignmentFaculty(null)}
          onSave={saveFaculty}
        />
      )}
      {confirmFaculty && (
        <div className="dialog-backdrop">
          <div className="confirmation-dialog">
            <span
              className={`confirm-icon ${
                confirmFaculty.status === "Active" ? "rose" : "sage"
              }`}
            >
              <Icon
                name={confirmFaculty.status === "Active" ? "warning" : "check"}
              />
            </span>
            <h2>
              {confirmFaculty.status === "Active" ? "Deactivate" : "Activate"}{" "}
              faculty account?
            </h2>
            <p>
              {confirmFaculty.name} will be marked{" "}
              {confirmFaculty.status === "Active"
                ? "inactive and unable to access the portal"
                : "active and able to access authorized classes"}
              . Historical academic records will not be removed.
            </p>
            <div>
              <Button variant="outline" onClick={() => setConfirmFaculty(null)}>
                Cancel
              </Button>
              <Button
                variant={
                  confirmFaculty.status === "Active" ? "secondary" : "primary"
                }
                onClick={() => {
                  const updated: FacultyRecord = {
                    ...confirmFaculty,
                    status:
                      confirmFaculty.status === "Active"
                        ? "Inactive"
                        : "Active",
                  }
                  setRecords((current) =>
                    current.map((item) =>
                      item.id === updated.id ? updated : item,
                    ),
                  )
                  setConfirmFaculty(null)
                  notify(
                    `Faculty account ${updated.status.toLowerCase()} successfully.`,
                  )
                }}
              >
                Confirm{" "}
                {confirmFaculty.status === "Active"
                  ? "deactivation"
                  : "activation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function AdminEnrollments() {
  const [status, setStatus] = useState("All statuses")
  const [search, setSearch] = useState("")
  const [saved, setSaved] = useState(false)
  const rows = [
    [
      "Arjun Nair",
      "2AB21CS042",
      "BE · CSD",
      "Semester 7 · A",
      "5 subjects",
      "Active",
    ],
    [
      "Riya Mehta",
      "2AB21CS018",
      "BE · CSD",
      "Semester 7 · A",
      "5 subjects",
      "Active",
    ],
    [
      "Dev Patel",
      "2AB22IS031",
      "BE · ISE",
      "Semester 5 · B",
      "6 subjects",
      "Review",
    ],
    ["Sara Khan", "2AB23EC014", "BE · ECE", "Semester 3 · A", "—", "Pending"],
  ].filter(
    (row) =>
      (status === "All statuses" || row[5] === status) &&
      (!search ||
        row[0].toLowerCase().includes(search.toLowerCase()) ||
        row[1].toLowerCase().includes(search.toLowerCase())),
  )
  return (
    <>
      <PageHeader
        role="Admin"
        active="Enrollment Management"
        action={{ text: "Create enrollment", onClick: () => setSaved(true) }}
      />
      {saved && (
        <div className="page-feedback success">
          <Icon name="check" />
          <span>
            <strong>Enrollment workspace ready</strong>Select an eligible
            student and verify the curriculum before confirmation.
          </span>
          <button onClick={() => setSaved(false)}>
            <Icon name="close" />
          </button>
        </div>
      )}
      <div className="nav-page-stats">
        <StatCard
          label="Active enrollments"
          value="3,716"
          delta="96.7%"
          icon="people"
          tone="sage"
        />
        <StatCard
          label="Pending review"
          value="38"
          delta="12 new"
          icon="warning"
          tone="rose"
        />
        <StatCard
          label="Curriculum matched"
          value="98.4%"
          delta="1.2%"
          icon="book"
          tone="olive"
        />
        <StatCard
          label="Approved exceptions"
          value="21"
          delta="This term"
          icon="assignment"
          tone="sand"
        />
      </div>
      <Card className="navigation-table-card">
        <div className="nav-page-toolbar">
          <div className="field-search">
            <Icon name="search" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search student name or USN…"
            />
          </div>
          <select>
            <option>All programs</option>
            <option>BE · CSD</option>
            <option>BE · ISE</option>
          </select>
          <select>
            <option>All semesters</option>
            <option>Semester 7</option>
            <option>Semester 5</option>
          </select>
          <select
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All statuses</option>
            <option>Active</option>
            <option>Review</option>
            <option>Pending</option>
          </select>
          <span className="spacer" />
          <Button variant="outline" icon="download">
            Export
          </Button>
        </div>
        {rows.length ? (
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Student</th>
                  <th>USN</th>
                  <th>Program</th>
                  <th>Academic assignment</th>
                  <th>Allocated subjects</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row[1]}>
                    <td>
                      <span className="person-cell">
                        <Avatar
                          initials={row[0]
                            .split(" ")
                            .map((part) => part[0])
                            .join("")}
                          small
                        />
                        <strong>{row[0]}</strong>
                      </span>
                    </td>
                    <td>{row[1]}</td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                    <td>
                      <Badge
                        tone={
                          row[5] === "Active"
                            ? "success"
                            : row[5] === "Review"
                              ? "warning"
                              : "rose"
                        }
                      >
                        {row[5]}
                      </Badge>
                    </td>
                    <td>
                      <Button variant="ghost">Review</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="faculty-empty">
            <span>
              <Icon name="people" />
            </span>
            <h2>No enrollments match</h2>
            <p>Adjust the search or enrollment status filter.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearch("")
                setStatus("All statuses")
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </Card>
    </>
  )
}

function ReportsAuditPage() {
  const [tab, setTab] = useState<"Reports" | "Audit history">("Reports")
  const [generated, setGenerated] = useState(false)
  const [reportSummary, setReportSummary] = useState("")
  const [generating, setGenerating] = useState(false)
  const generateReport = async () => {
    if (generating) return
    setGenerating(true)
    try {
      setReportSummary(
        await askAI(
          "Prepare a concise executive summary for the selected institutional report.",
          "Administrator report context: academic session 2024-25 semester 2; authorized records are selected by the administrator. Do not invent statistics or claim access to data not provided.",
        ),
      )
      setGenerated(true)
    } catch (error) {
      setReportSummary(
        error instanceof Error ? error.message : "The AI assistant could not respond.",
      )
      setGenerated(true)
    } finally {
      setGenerating(false)
    }
  }
  return (
    <>
      <PageHeader role="Admin" active="Reports & Audit History" />
      <div className="content-tabs">
        <button
          className={tab === "Reports" ? "active" : ""}
          onClick={() => setTab("Reports")}
        >
          <Icon name="report" />
          Reports
        </button>
        <button
          className={tab === "Audit history" ? "active" : ""}
          onClick={() => setTab("Audit history")}
        >
          <Icon name="clock" />
          Audit history
        </button>
      </div>
      {generated && (
        <div className="page-feedback success">
          <Icon name="check" />
          <span>
            <strong>Report generated</strong>The preview is ready for review and
            printing.
            {reportSummary && (
              <span>
                AI summary: <span className="ai-response">{cleanAIText(reportSummary)}</span>
              </span>
            )}
          </span>
          <button onClick={() => setGenerated(false)}>
            <Icon name="close" />
          </button>
        </div>
      )}
      {tab === "Reports" ? (
        <div className="reports-page-grid">
          <Card className="report-builder">
            <div className="config-card-head">
              <div>
                <h2>Generate institutional report</h2>
                <p>Use authorized academic records and selected filters</p>
              </div>
              <Badge tone="moss">Print ready</Badge>
            </div>
            <div className="report-form">
              <label>
                Report category
                <select>
                  <option>Academic performance</option>
                  <option>Attendance summary</option>
                  <option>Assignment status</option>
                  <option>Examination results</option>
                  <option>Certificate records</option>
                </select>
              </label>
              <label>
                Academic session
                <select>
                  <option>2024–25 · Semester 2</option>
                </select>
              </label>
              <label>
                Department
                <select>
                  <option>All departments</option>
                  <option>Computer Science and Design</option>
                </select>
              </label>
              <label>
                Date range
                <div className="report-date-fields">
                  <input type="date" defaultValue="2025-06-01" />
                  <input type="date" defaultValue="2025-06-30" />
                </div>
              </label>
            </div>
            <div className="report-actions">
              <Button variant="outline">Reset</Button>
              <Button icon="report" onClick={generateReport}>
                {generating ? "Generating…" : "Generate report"}
              </Button>
            </div>
          </Card>
          <Card className="saved-reports">
            <div className="config-card-head">
              <div>
                <h2>Recent reports</h2>
                <p>Generated by authorized administrators</p>
              </div>
            </div>
            {[
              [
                "Semester attendance summary",
                "PDF · 18 June 2025",
                "Attendance",
              ],
              ["CSD academic performance", "XLSX · 16 June 2025", "Academic"],
              [
                "Published results register",
                "PDF · 12 June 2025",
                "Examinations",
              ],
            ].map((item) => (
              <div className="saved-report-row" key={item[0]}>
                <span>
                  <Icon name="report" />
                </span>
                <div>
                  <strong>{item[0]}</strong>
                  <small>
                    {item[1]} · {item[2]}
                  </small>
                </div>
                <button className="icon-btn">
                  <Icon name="download" />
                </button>
              </div>
            ))}
          </Card>
        </div>
      ) : (
        <Card className="audit-card">
          <div className="nav-page-toolbar">
            <div className="field-search">
              <Icon name="search" />
              <input placeholder="Search user, action, or entity…" />
            </div>
            <select>
              <option>All actions</option>
              <option>Updated</option>
              <option>Published</option>
              <option>Assigned</option>
            </select>
            <select>
              <option>Last 30 days</option>
            </select>
            <span className="spacer" />
            <Button variant="outline" icon="download">
              Export audit
            </Button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Action</th>
                  <th>Affected entity</th>
                  <th>Date & time</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Dr. Ananya Rao",
                    "Updated",
                    "CSD-2023 Curriculum",
                    "18 Jun · 10:42 AM",
                    "Added BCS714A elective",
                  ],
                  [
                    "Prof. Maya Sen",
                    "Published",
                    "Graph Traversal Assignment",
                    "18 Jun · 9:18 AM",
                    "CSD Semester 7 · A",
                  ],
                  [
                    "Dr. Ananya Rao",
                    "Assigned",
                    "Arjun Nair · 2AB21CS042",
                    "17 Jun · 4:35 PM",
                    "Semester 7 curriculum",
                  ],
                  [
                    "System workflow",
                    "Notified",
                    "Low attendance cohort",
                    "17 Jun · 3:00 PM",
                    "62 student alerts queued",
                  ],
                ].map((row) => (
                  <tr key={`${row[0]}-${row[3]}`}>
                    <td>
                      <strong>{row[0]}</strong>
                    </td>
                    <td>
                      <Badge
                        tone={row[1] === "Published" ? "success" : "neutral"}
                      >
                        {row[1]}
                      </Badge>
                    </td>
                    <td>{row[2]}</td>
                    <td>{row[3]}</td>
                    <td>{row[4]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </>
  )
}

function FacultyClassesPage({
  onNavigate,
}: {
  onNavigate: (page: string) => void
}) {
  const classes = [
    [
      "Machine Learning",
      "BCS701",
      "Semester 7 · Section A",
      "48",
      "91%",
      "Next: Today · 11:30 AM",
    ],
    [
      "Cloud Computing",
      "BCS703",
      "Semester 7 · Section A",
      "48",
      "78%",
      "Next: Tomorrow · 9:00 AM",
    ],
    [
      "Algorithms",
      "BCS503",
      "Semester 5 · Section B",
      "52",
      "86%",
      "Next: Thursday · 2:00 PM",
    ],
  ]
  return (
    <>
      <PageHeader role="Faculty" active="My Classes" />
      <div className="faculty-class-grid">
        {classes.map((item, index) => (
          <Card className="faculty-class-card" key={item[1]}>
            <div className="class-card-top">
              <span className={`allocated-icon subject-${index}`}>
                <Icon name="book" />
              </span>
              <Badge tone="moss">Active class</Badge>
            </div>
            <h2>{item[0]}</h2>
            <p>
              {item[1]} · {item[2]}
            </p>
            <div className="class-card-metrics">
              <div>
                <span>Students</span>
                <strong>{item[3]}</strong>
              </div>
              <div>
                <span>Attendance</span>
                <strong>{item[4]}</strong>
              </div>
            </div>
            <div className="class-next">
              <Icon name="calendar" />
              {item[5]}
            </div>
            <div className="class-card-actions">
              <Button
                variant="outline"
                onClick={() => onNavigate("Attendance")}
              >
                Attendance
              </Button>
              <Button onClick={() => onNavigate("Assignments")}>
                Open class
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="authorized-access-note">
        <Icon name="check" />
        <span>
          <strong>Authorized teaching access</strong>Student rosters and
          academic actions are limited to the classes and subjects assigned in
          your institutional record.
        </span>
      </Card>
    </>
  )
}

function FacultyAttendancePage() {
  const studentNames = [
    "Arjun Nair",
    "Riya Mehta",
    "Dev Patel",
    "Sara Khan",
    "Kabir Das",
    "Meera Iyer",
  ]
  const [attendance, setAttendance] =
    useState<Record<string, "Present" | "Absent">>(
      Object.fromEntries(studentNames.map((name) => [name, "Present"])),
    )
  const [saved, setSaved] = useState(false)
  const present = Object.values(attendance).filter(
    (value) => value === "Present",
  ).length
  return (
    <>
      <PageHeader
        role="Faculty"
        active="Attendance Management"
        action={{ text: "Save attendance", onClick: () => setSaved(true) }}
      />
      {saved && (
        <div className="page-feedback success">
          <Icon name="check" />
          <span>
            <strong>Attendance saved successfully</strong>
            {present} present and {studentNames.length - present} absent records
            were saved.
          </span>
          <button onClick={() => setSaved(false)}>
            <Icon name="close" />
          </button>
        </div>
      )}
      <Card className="attendance-session-card">
        <div className="attendance-session-controls">
          <label>
            Subject
            <select>
              <option>Machine Learning · BCS701</option>
              <option>Cloud Computing · BCS703</option>
            </select>
          </label>
          <label>
            Class / section
            <select>
              <option>Semester 7 · Section A</option>
            </select>
          </label>
          <label>
            Attendance date
            <input type="date" defaultValue="2025-06-18" />
          </label>
          <div>
            <span>Session summary</span>
            <strong>
              {present} present · {studentNames.length - present} absent
            </strong>
          </div>
        </div>
        <div className="attendance-roster-head">
          <div>
            <h2>Student attendance roster</h2>
            <p>Manual attendance · No biometric or face recognition</p>
          </div>
          <Button
            variant="outline"
            onClick={() =>
              setAttendance(
                Object.fromEntries(
                  studentNames.map((name) => [name, "Present"]),
                ),
              )
            }
          >
            Mark all present
          </Button>
        </div>
        <div className="faculty-roster">
          {studentNames.map((name, index) => (
            <div className="faculty-roster-row" key={name}>
              <span>{index + 1}</span>
              <Avatar
                initials={name
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
                small
              />
              <div>
                <strong>{name}</strong>
                <small>2AB21CS0{42 + index}</small>
              </div>
              <div className="attendance-toggle">
                <button
                  className={
                    attendance[name] === "Present"
                      ? "present active"
                      : "present"
                  }
                  onClick={() =>
                    setAttendance((current) => ({
                      ...current,
                      [name]: "Present",
                    }))
                  }
                >
                  <Icon name="check" size={14} />
                  Present
                </button>
                <button
                  className={
                    attendance[name] === "Absent" ? "absent active" : "absent"
                  }
                  onClick={() =>
                    setAttendance((current) => ({
                      ...current,
                      [name]: "Absent",
                    }))
                  }
                >
                  <Icon name="close" size={14} />
                  Absent
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </>
  )
}

function ExamsResultsPage({ role }: { role: "Faculty" | "Student" }) {
  const [published, setPublished] = useState(false)
  if (role === "Student")
    return (
      <>
        <PageHeader role="Student" active="Exams & Results" />
        <div className="result-summary-grid">
          <Card>
            <span>Semester GPA</span>
            <strong>8.42</strong>
            <small>Published institutional result</small>
          </Card>
          <Card>
            <span>Credits completed</span>
            <strong>16 / 16</strong>
            <small>Current published term</small>
          </Card>
          <Card>
            <span>Result status</span>
            <Badge tone="success">Published</Badge>
            <small>12 June 2025</small>
          </Card>
        </div>
        <Card className="student-results-card">
          <div className="config-card-head">
            <div>
              <h2>Published subject results</h2>
              <p>Semester 7 · Official records only</p>
            </div>
            <Button variant="outline" icon="download">
              Download report card
            </Button>
          </div>
          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Code</th>
                  <th>Credits</th>
                  <th>Marks</th>
                  <th>Grade</th>
                  <th>Grade point</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Machine Learning", "BCS701", "4", "84 / 100", "A", "9"],
                  ["Deep Learning", "BCS714A", "3", "78 / 100", "A", "9"],
                  ["Computer Networks", "BCS702", "4", "72 / 100", "B+", "8"],
                  ["Project Management", "BCS704", "2", "86 / 100", "A+", "10"],
                ].map((row) => (
                  <tr key={row[1]}>
                    {row.map((cell) => (
                      <td key={cell}>{cell}</td>
                    ))}
                    <td>
                      <Badge tone="success">Published</Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="attendance-footnote">
            <Icon name="check" />
            Only institutionally published results are displayed as official.
          </div>
        </Card>
      </>
    )
  return (
    <>
      <PageHeader
        role="Faculty"
        active="Exams & Results"
        action={{ text: "Create examination" }}
      />
      {published && (
        <div className="page-feedback success">
          <Icon name="check" />
          <span>
            <strong>Results published</strong>Authorized students can now view
            the official result.
          </span>
          <button onClick={() => setPublished(false)}>
            <Icon name="close" />
          </button>
        </div>
      )}
      <Card className="faculty-results-card">
        <div className="config-card-head">
          <div>
            <h2>Machine Learning · Mid-semester examination</h2>
            <p>BCS701 · Semester 7 · Section A · Maximum 50 marks</p>
          </div>
          <Badge tone="warning">Draft results</Badge>
        </div>
        <div className="nav-page-toolbar">
          <div className="field-search">
            <Icon name="search" />
            <input placeholder="Search student or USN…" />
          </div>
          <Button variant="outline">Validate marks</Button>
          <span className="spacer" />
          <Button onClick={() => setPublished(true)}>Review & publish</Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Student</th>
                <th>USN</th>
                <th>Marks / 50</th>
                <th>Percentage</th>
                <th>Grade</th>
                <th>Validation</th>
              </tr>
            </thead>
            <tbody>
              {[
                ["Arjun Nair", "2AB21CS042", "42", "84%", "A"],
                ["Riya Mehta", "2AB21CS018", "39", "78%", "A"],
                ["Dev Patel", "2AB21CS031", "36", "72%", "B+"],
                ["Sara Khan", "2AB21CS014", "31", "62%", "B"],
              ].map((row) => (
                <tr key={row[1]}>
                  <td>
                    <strong>{row[0]}</strong>
                  </td>
                  <td>{row[1]}</td>
                  <td>
                    <input className="marks-input" defaultValue={row[2]} />
                  </td>
                  <td>{row[3]}</td>
                  <td>{row[4]}</td>
                  <td>
                    <Badge tone="success">
                      <Icon name="check" size={11} />
                      Valid
                    </Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </>
  )
}

function NotificationsPage({
  role,
  onNavigate,
}: {
  role: Role
  onNavigate: (page: string) => void
}) {
  const [unread, setUnread] = useState([0, 1, 2])
  const notices = [
    [
      "Attendance threshold alert",
      role === "Admin"
        ? "62 students require review across three departments."
        : "Attendance in Cloud Computing requires attention.",
      "Attendance",
      "Today · 10:30 AM",
    ],
    [
      "Assignment published",
      "Graph Traversal & Applications is now available.",
      "Assignments",
      "Today · 9:15 AM",
    ],
    [
      "Results publication update",
      role === "Faculty"
        ? "Machine Learning results are ready for faculty review."
        : "Semester results have been published.",
      "Exams & results",
      "Yesterday · 4:20 PM",
    ],
    [
      "Academic record updated",
      "Your authorized academic context has been refreshed.",
      "Profile",
      "16 June · 2:00 PM",
    ],
  ]
  return (
    <>
      <PageHeader
        role={role}
        active="Notifications"
        action={{ text: "Mark all as read", onClick: () => setUnread([]) }}
      />
      <Card className="notifications-page-card">
        <div className="notifications-page-head">
          <div>
            <h2>All notifications</h2>
            <p>Academic updates, reminders, and institutional alerts</p>
          </div>
          <Badge tone="rose">{unread.length} unread</Badge>
        </div>
        {notices.map((notice, index) => (
          <button
            className={`notification-page-row ${
              unread.includes(index) ? "unread" : ""
            }`}
            key={notice[0]}
            onClick={() => {
              setUnread((current) => current.filter((item) => item !== index))
              const target =
                role === "Admin"
                  ? notice[2] === "Attendance"
                    ? "Analytics"
                    : notice[2] === "Profile"
                      ? "Profile"
                      : "Reports & audit"
                  : notice[2]
              onNavigate(target)
            }}
          >
            <i />
            <span className="notification-page-icon">
              <Icon
                name={
                  index === 0
                    ? "warning"
                    : index === 1
                      ? "assignment"
                      : index === 2
                        ? "report"
                        : "people"
                }
              />
            </span>
            <div>
              <strong>{notice[0]}</strong>
              <p>{notice[1]}</p>
              <small>{notice[3]}</small>
            </div>
            <Badge tone={index === 0 ? "warning" : "neutral"}>
              {notice[2]}
            </Badge>
            <Icon name="chevron" />
          </button>
        ))}
      </Card>
    </>
  )
}

function Directory({ role }: { role: Role }) {
  const isStudents = role !== "Faculty"
  const rows = [
    [
      "Riya Mehta",
      "AIC2024001",
      "Computer Science",
      "Semester 5",
      "Active",
      "RM",
    ],
    [
      "Dev Patel",
      "AIC2024002",
      "Computer Science",
      "Semester 5",
      "Active",
      "DP",
    ],
    [
      "Sara Khan",
      "AIC2024003",
      "Information Technology",
      "Semester 3",
      "At risk",
      "SK",
    ],
    [
      "Kabir Das",
      "AIC2024004",
      "Mechanical Engineering",
      "Semester 3",
      "Active",
      "KD",
    ],
    [
      "Meera Iyer",
      "AIC2024005",
      "Computer Science",
      "Semester 5",
      "Inactive",
      "MI",
    ],
  ]
  return (
    <>
      <PageHeader
        role={role}
        active={role === "Admin" ? "Students" : "My classes"}
        action={{ text: isStudents ? "Add student" : "Add class" }}
      />
      <Card className="table-card">
        <div className="table-tools">
          <div className="field-search">
            <Icon name="search" />
            <input placeholder="Search by name or ID…" />
          </div>
          <select>
            <option>All departments</option>
          </select>
          <select>
            <option>All semesters</option>
          </select>
          <Button variant="outline">More filters</Button>
          <span className="spacer" />
          <Button variant="ghost" icon="download">
            Export
          </Button>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>
                  <input type="checkbox" />
                </th>
                <th>Student</th>
                <th>Student ID</th>
                <th>Department</th>
                <th>Semester</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r[1]}>
                  <td>
                    <input type="checkbox" />
                  </td>
                  <td>
                    <span className="person-cell">
                      <Avatar initials={r[5]} small />
                      <strong>{r[0]}</strong>
                    </span>
                  </td>
                  <td>{r[1]}</td>
                  <td>{r[2]}</td>
                  <td>{r[3]}</td>
                  <td>
                    <Badge
                      tone={
                        r[4] === "Active"
                          ? "success"
                          : r[4] === "At risk"
                            ? "warning"
                            : "neutral"
                      }
                    >
                      {r[4]}
                    </Badge>
                  </td>
                  <td>
                    <button className="icon-btn">
                      <Icon name="more" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pagination">
          <span>Showing 1–5 of 3,842</span>
          <div>
            <Button variant="outline">Previous</Button>
            <button className="page active">1</button>
            <button className="page">2</button>
            <button className="page">3</button>
            <Button variant="outline">Next</Button>
          </div>
        </div>
      </Card>
    </>
  )
}

function Assignments({ role }: { role: Role }) {
  const [created, setCreated] = useState(false)
  return (
    <>
      <PageHeader
        role={role}
        active="Assignments"
        action={
          role === "Faculty"
            ? { text: "Create assignment", onClick: () => setCreated(true) }
            : undefined
        }
      />
      {created && (
        <div className="success-toast">
          <span>
            <Icon name="check" />
          </span>
          <div>
            <strong>Assignment draft created</strong>
            <p>You can review and publish it when ready.</p>
          </div>
          <button onClick={() => setCreated(false)}>
            <Icon name="close" />
          </button>
        </div>
      )}
      <div className="assignment-layout">
        <Card className="assignment-list">
          <div className="tabs">
            <button className="active">
              All assignments <b>8</b>
            </button>
            <button>
              Pending <b>3</b>
            </button>
            <button>
              {role === "Faculty" ? "Drafts" : "Submitted"} <b>2</b>
            </button>
            <button>Closed</button>
          </div>
          <div className="table-tools">
            <div className="field-search">
              <Icon name="search" />
              <input placeholder="Search assignments…" />
            </div>
            <select>
              <option>All subjects</option>
            </select>
          </div>
          {[
            [
              "Graph Traversal & Applications",
              "Data Structures · CS301",
              "Due tomorrow, 11:59 PM",
              "Published",
              "32 / 48",
              "rose",
            ],
            [
              "Database Normalization",
              "Database Systems · CS305",
              "Due 24 Jun, 11:59 PM",
              role === "Student" ? "Submitted" : "Published",
              "41 / 52",
              "olive",
            ],
            [
              "Network Topologies",
              "Computer Networks · CS307",
              "Due 28 Jun, 11:59 PM",
              "Draft",
              "—",
              "sand",
            ],
            [
              "Greedy Algorithms",
              "Algorithms · CS303",
              "Closed 12 Jun",
              "Closed",
              "49 / 50",
              "neutral",
            ],
          ].map((a, i) => (
            <button
              className={`assignment-row ${i === 0 ? "selected" : ""}`}
              key={a[0]}
            >
              <span className={`assignment-icon ${a[5]}`}>
                <Icon name="assignment" />
              </span>
              <div>
                <strong>{a[0]}</strong>
                <small>{a[1]}</small>
              </div>
              <span className="due">
                <Icon name="clock" size={15} />
                {a[2]}
              </span>
              <Badge
                tone={
                  a[3] === "Published" || a[3] === "Submitted"
                    ? "success"
                    : a[3] === "Draft"
                      ? "warning"
                      : "neutral"
                }
              >
                {a[3]}
              </Badge>
              <span className="submission-count">
                {role === "Student" ? (i === 1 ? "Submitted" : "View") : a[4]}
              </span>
              <Icon name="chevron" />
            </button>
          ))}
        </Card>
        <Card className="assignment-detail">
          <div className="detail-top">
            <div>
              <Badge tone="success">Published</Badge>
              <span>CS301 · Data Structures</span>
            </div>
            <button className="icon-btn">
              <Icon name="more" />
            </button>
          </div>
          <h2>Graph Traversal & Applications</h2>
          <p className="detail-intro">
            Demonstrate your understanding of graph traversal algorithms and
            their real-world applications.
          </p>
          <div className="detail-meta">
            <div>
              <span>Deadline</span>
              <strong>19 June, 11:59 PM</strong>
            </div>
            <div>
              <span>Maximum marks</span>
              <strong>20 marks</strong>
            </div>
            <div>
              <span>
                {role === "Faculty" ? "Submissions" : "Submission status"}
              </span>
              <strong>
                {role === "Faculty" ? "32 of 48" : "Not submitted"}
              </strong>
            </div>
          </div>
          <div className="instructions">
            <h3>Instructions</h3>
            <p>
              Explain BFS and DFS with clear examples. Compare their time and
              space complexity, then identify two practical applications for
              each traversal method.
            </p>
            <ul>
              <li>Use diagrams where appropriate.</li>
              <li>Include original examples and cite any references.</li>
              <li>Submit as a PDF, maximum 10 MB.</li>
            </ul>
          </div>
          {role === "Faculty" ? (
            <div className="ai-eval-box">
              <span>
                <Icon name="sparkle" />
              </span>
              <div>
                <strong>AI evaluation is available</strong>
                <p>
                  6 submissions have suggestions ready for faculty review. AI
                  scores are not official until you finalize them.
                </p>
              </div>
              <Button variant="secondary">Review suggestions</Button>
            </div>
          ) : (
            <div className="upload-box">
              <span className="upload-icon">
                <Icon name="download" />
              </span>
              <strong>Drop your submission here</strong>
              <p>PDF or DOCX · Maximum 10 MB</p>
              <Button variant="outline">Choose file</Button>
            </div>
          )}
          <div className="detail-actions">
            <Button variant="outline">
              {role === "Faculty" ? "Edit assignment" : "Save draft"}
            </Button>
            <Button>
              {role === "Faculty" ? "View submissions" : "Submit assignment"}
            </Button>
          </div>
        </Card>
      </div>
    </>
  )
}

type AttendanceRisk = "Low" | "Medium" | "High"

type AttendanceSubject = {
  name: string
  code: string
  department: string
  semester: string
  attended: number
  total: number
  risk: AttendanceRisk
  status: "Safe" | "Monitor" | "At Risk"
}

const attendanceSubjects: AttendanceSubject[] = [
  {
    name: "Machine Learning",
    code: "BCS701",
    department: "CSD",
    semester: "7th",
    attended: 38,
    total: 40,
    risk: "Low",
    status: "Safe",
  },
  {
    name: "Deep Learning",
    code: "BCS714A",
    department: "CSD",
    semester: "7th",
    attended: 30,
    total: 36,
    risk: "Low",
    status: "Safe",
  },
  {
    name: "Computer Networks",
    code: "BCS702",
    department: "CSD",
    semester: "7th",
    attended: 27,
    total: 36,
    risk: "Medium",
    status: "Monitor",
  },
  {
    name: "Cloud Computing",
    code: "BCS703",
    department: "CSD",
    semester: "7th",
    attended: 22,
    total: 36,
    risk: "High",
    status: "At Risk",
  },
  {
    name: "Project Management",
    code: "BCS704",
    department: "CSD",
    semester: "7th",
    attended: 18,
    total: 32,
    risk: "High",
    status: "At Risk",
  },
]

const attendanceHistory = [
  { date: "18 Jun 2025", session: "Cloud service models", status: "Present" },
  {
    date: "16 Jun 2025",
    session: "Virtualization fundamentals",
    status: "Absent",
  },
  { date: "13 Jun 2025", session: "Cloud architecture", status: "Present" },
  { date: "11 Jun 2025", session: "Distributed systems", status: "Present" },
  { date: "09 Jun 2025", session: "Introduction to cloud", status: "Absent" },
]

function AttendanceRiskBadge({
  risk,
  status = false,
}: {
  risk: AttendanceRisk
  status?: boolean
}) {
  const statusText =
    risk === "Low" ? "Safe" : risk === "Medium" ? "Monitor" : "At Risk"
  return (
    <span className={`attendance-badge risk-${risk.toLowerCase()}`}>
      <Icon name={risk === "Low" ? "check" : "warning"} size={12} />
      {status ? statusText : `${risk} Risk`}
    </span>
  )
}

function AttendanceDetails({
  subject,
  onClose,
}: {
  subject: AttendanceSubject
  onClose: () => void
}) {
  const percentage = (subject.attended / subject.total) * 100
  const trend = [72, 68, 70, 64, 66, percentage]
  return (
    <>
      <button
        className="drawer-backdrop"
        onClick={onClose}
        aria-label="Close attendance details"
      />
      <aside
        className="attendance-drawer"
        aria-label="Subject attendance details"
      >
        <div className="drawer-head">
          <div>
            <span className="drawer-kicker">SUBJECT ATTENDANCE</span>
            <h2>{subject.name}</h2>
            <p>
              {subject.code} · {subject.department} · Semester{" "}
              {subject.semester}
            </p>
          </div>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </div>
        <div className="drawer-summary">
          <div
            className={`attendance-ring risk-${subject.risk.toLowerCase()}`}
            style={
              {
                "--attendance": `${percentage * 3.6}deg`,
              } as React.CSSProperties
            }
          >
            <div>
              <strong>{percentage.toFixed(1).replace(".0", "")}%</strong>
              <span>attendance</span>
            </div>
          </div>
          <div className="drawer-counts">
            <div>
              <span>Classes attended</span>
              <strong>{subject.attended}</strong>
            </div>
            <div>
              <span>Total classes</span>
              <strong>{subject.total}</strong>
            </div>
            <div>
              <span>Current status</span>
              <AttendanceRiskBadge risk={subject.risk} status />
            </div>
          </div>
        </div>
        <div
          className={`attendance-explanation risk-${subject.risk.toLowerCase()}`}
        >
          <Icon name={subject.risk === "Low" ? "check" : "warning"} />
          <div>
            <strong>
              {subject.risk === "Low"
                ? "Your attendance is currently safe"
                : subject.risk === "Medium"
                  ? "Keep monitoring this subject"
                  : "This subject needs your attention"}
            </strong>
            <p>
              Status is based on your institution’s configured attendance and
              warning thresholds, not a universal academic rule.
            </p>
          </div>
        </div>
        <section className="drawer-section">
          <div className="drawer-section-head">
            <div>
              <h3>Attendance trend</h3>
              <p>Recent recorded sessions</p>
            </div>
            <Badge tone="neutral">Last 6 weeks</Badge>
          </div>
          <div className="attendance-trend" aria-label="Attendance trend chart">
            {trend.map((value, index) => (
              <div key={index}>
                <span style={{ height: `${value}%` }} />
                <small>W{index + 1}</small>
              </div>
            ))}
          </div>
        </section>
        <section className="drawer-section history-section">
          <div className="drawer-section-head">
            <div>
              <h3>Attendance history</h3>
              <p>Latest authorized records</p>
            </div>
          </div>
          {attendanceHistory.map((record) => (
            <div
              className="history-row"
              key={`${record.date}-${record.session}`}
            >
              <span className={`history-icon ${record.status.toLowerCase()}`}>
                <Icon
                  name={record.status === "Present" ? "check" : "close"}
                  size={14}
                />
              </span>
              <div>
                <strong>{record.session}</strong>
                <small>{record.date}</small>
              </div>
              <Badge tone={record.status === "Present" ? "success" : "rose"}>
                {record.status}
              </Badge>
            </div>
          ))}
        </section>
        <div className="drawer-privacy">
          <Icon name="eye" size={15} />
          Only attendance records authorized for your account are shown.
        </div>
      </aside>
    </>
  )
}

function StudentAttendance() {
  const [search, setSearch] = useState("")
  const [department, setDepartment] = useState("All departments")
  const [semester, setSemester] = useState("All semesters")
  const [risk, setRisk] = useState("All risk levels")
  const [status, setStatus] = useState("All statuses")
  const [sort, setSort] = useState("Highest attendance")
  const [selected, setSelected] = useState<AttendanceSubject | null>(null)

  const percentage = (subject: AttendanceSubject) =>
    (subject.attended / subject.total) * 100
  const totalAttended = attendanceSubjects.reduce(
    (sum, subject) => sum + subject.attended,
    0,
  )
  const totalClasses = attendanceSubjects.reduce(
    (sum, subject) => sum + subject.total,
    0,
  )
  const overall = (totalAttended / totalClasses) * 100
  const safeCount = attendanceSubjects.filter(
    (subject) => subject.status === "Safe",
  ).length
  const riskCount = attendanceSubjects.filter(
    (subject) => subject.status === "At Risk",
  ).length

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return attendanceSubjects
      .filter(
        (subject) =>
          (!term ||
            subject.name.toLowerCase().includes(term) ||
            subject.code.toLowerCase().includes(term)) &&
          (department === "All departments" ||
            subject.department === department) &&
          (semester === "All semesters" || subject.semester === semester) &&
          (risk === "All risk levels" || subject.risk === risk) &&
          (status === "All statuses" || subject.status === status),
      )
      .sort((a, b) =>
        sort === "Lowest attendance"
          ? percentage(a) - percentage(b)
          : percentage(b) - percentage(a),
      )
  }, [search, department, semester, risk, status, sort])

  const clearFilters = () => {
    setSearch("")
    setDepartment("All departments")
    setSemester("All semesters")
    setRisk("All risk levels")
    setStatus("All statuses")
    setSort("Highest attendance")
  }

  return (
    <div className="attendance-page">
      <div className="attendance-page-head">
        <div>
          <div className="eyebrow">
            Student Dashboard <span>/</span> Attendance
          </div>
          <h1>My Attendance</h1>
          <p>
            Track your subject-wise attendance and stay on top of your academic
            requirements.
          </p>
        </div>
        <div className="academic-context">
          <div>
            <span>Academic year</span>
            <strong>2024–25</strong>
          </div>
          <div>
            <span>Semester</span>
            <strong>7th</strong>
          </div>
          <div>
            <span>Department</span>
            <strong>{studentAcademicProfile.department}</strong>
          </div>
        </div>
      </div>

      <div className="attendance-summary-grid">
        <Card className="attendance-summary overall-summary">
          <div
            className="summary-ring"
            style={
              { "--attendance": `${overall * 3.6}deg` } as React.CSSProperties
            }
          >
            <div>
              <strong>{overall.toFixed(1)}%</strong>
            </div>
          </div>
          <div>
            <span>Overall attendance</span>
            <strong>
              {totalAttended} of {totalClasses} classes
            </strong>
            <small>Institution-defined aggregation</small>
          </div>
        </Card>
        <Card className="attendance-summary">
          <span className="summary-icon sand">
            <Icon name="book" />
          </span>
          <div>
            <span>Total subjects</span>
            <strong>{attendanceSubjects.length}</strong>
            <small>Currently enrolled</small>
          </div>
        </Card>
        <Card className="attendance-summary">
          <span className="summary-icon sage">
            <Icon name="check" />
          </span>
          <div>
            <span>Safe subjects</span>
            <strong>{safeCount}</strong>
            <small>Meeting configured threshold</small>
          </div>
        </Card>
        <Card className="attendance-summary">
          <span className="summary-icon rose">
            <Icon name="warning" />
          </span>
          <div>
            <span>At-risk subjects</span>
            <strong>{riskCount}</strong>
            <small>Attendance needs attention</small>
          </div>
        </Card>
      </div>

      <Card className="attendance-warning-card">
        <span className="warning-mark">
          <Icon name="warning" />
        </span>
        <div>
          <div className="warning-title-row">
            <h2>Cloud Computing needs your attention</h2>
            <AttendanceRiskBadge risk="High" status />
          </div>
          <p>
            Your attendance in Cloud Computing is below the configured
            requirement. Review your attendance history and plan your upcoming
            classes carefully.
          </p>
          <div className="warning-facts">
            <span>
              Current attendance <strong>61.1%</strong>
            </span>
            <span>
              Configured minimum <strong>75%</strong>
            </span>
          </div>
        </div>
        <Button
          variant="secondary"
          onClick={() =>
            setSelected(
              attendanceSubjects.find(
                (subject) => subject.name === "Cloud Computing",
              ) ?? null,
            )
          }
        >
          View details
        </Button>
      </Card>

      <Card className="attendance-table-card">
        <div className="attendance-table-heading">
          <div>
            <h2>My Subjects — Attendance Overview</h2>
            <p>
              Illustrative records for the current semester · Updated 18 June
              2025
            </p>
          </div>
          <Badge tone="neutral">{filtered.length} subjects</Badge>
        </div>
        <div className="attendance-filters">
          <div className="field-search attendance-search">
            <Icon name="search" />
            <input
              aria-label="Search subjects"
              placeholder="Search subject or code…"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>
          <select
            aria-label="Filter by department"
            value={department}
            onChange={(event) => setDepartment(event.target.value)}
          >
            <option>All departments</option>
            <option>CSD</option>
          </select>
          <select
            aria-label="Filter by semester"
            value={semester}
            onChange={(event) => setSemester(event.target.value)}
          >
            <option>All semesters</option>
            <option>7th</option>
          </select>
          <select
            aria-label="Filter by risk level"
            value={risk}
            onChange={(event) => setRisk(event.target.value)}
          >
            <option>All risk levels</option>
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <select
            aria-label="Filter by status"
            value={status}
            onChange={(event) => setStatus(event.target.value)}
          >
            <option>All statuses</option>
            <option>Safe</option>
            <option>Monitor</option>
            <option>At Risk</option>
          </select>
          <select
            aria-label="Sort subjects"
            value={sort}
            onChange={(event) => setSort(event.target.value)}
          >
            <option>Highest attendance</option>
            <option>Lowest attendance</option>
          </select>
          <button className="clear-filters" onClick={clearFilters}>
            Clear all
          </button>
        </div>

        {filtered.length ? (
          <div className="attendance-table-scroll">
            <table className="attendance-table">
              <thead>
                <tr>
                  <th>Subject Name</th>
                  <th>Subject Code</th>
                  <th>Department</th>
                  <th>Semester</th>
                  <th>Classes Attended</th>
                  <th>Total Classes</th>
                  <th>Attendance Percentage</th>
                  <th>Risk Level</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((subject) => {
                  const value = percentage(subject)
                  return (
                    <tr key={subject.code} onClick={() => setSelected(subject)}>
                      <td data-label="Subject Name">
                        <button className="subject-name-button">
                          <span
                            className={`subject-dot risk-${subject.risk.toLowerCase()}`}
                          />
                          <span>
                            <strong>{subject.name}</strong>
                            <small>View attendance details</small>
                          </span>
                        </button>
                      </td>
                      <td data-label="Subject Code">
                        <code>{subject.code}</code>
                      </td>
                      <td data-label="Department">{subject.department}</td>
                      <td data-label="Semester">{subject.semester}</td>
                      <td data-label="Classes Attended">
                        <strong>{subject.attended}</strong>
                      </td>
                      <td data-label="Total Classes">{subject.total}</td>
                      <td data-label="Attendance Percentage">
                        <div
                          className={`table-percentage risk-${subject.risk.toLowerCase()}`}
                        >
                          <strong>{value.toFixed(1).replace(".0", "")}%</strong>
                          <div>
                            <span style={{ width: `${value}%` }} />
                          </div>
                        </div>
                      </td>
                      <td data-label="Risk Level">
                        <AttendanceRiskBadge risk={subject.risk} />
                      </td>
                      <td data-label="Status">
                        <AttendanceRiskBadge risk={subject.risk} status />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="attendance-empty">
            <span>
              <Icon name="search" />
            </span>
            <h3>No matching subjects</h3>
            <p>
              Try a different subject name or clear your attendance filters.
            </p>
            <Button variant="outline" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
        <div className="attendance-footnote">
          <Icon name="warning" size={14} />
          Attendance status follows institution-configured minimum and warning
          thresholds. Contact your department if a record appears incorrect.
        </div>
      </Card>
      {selected && (
        <AttendanceDetails
          subject={selected}
          onClose={() => setSelected(null)}
        />
      )}
    </div>
  )
}

function Analytics({ role }: { role: Role }) {
  return (
    <>
      <PageHeader
        role={role}
        active={role === "Student" ? "Exams & results" : "Analytics"}
        action={{ text: "Export report" }}
      />
      <div className="filter-bar">
        <span>
          <Icon name="calendar" /> Academic period
        </span>
        <select>
          <option>Semester 2 · 2024–25</option>
        </select>
        <select>
          <option>All departments</option>
        </select>
        <select>
          <option>All programs</option>
        </select>
        <Button variant="outline">Apply filters</Button>
      </div>
      <div className="analytics-grid">
        <Card className="analytics-hero">
          <div className="card-head">
            <div>
              <h2>Performance distribution</h2>
              <p>Students grouped by average academic score</p>
            </div>
            <Badge tone="neutral">3,842 students</Badge>
          </div>
          <div className="bar-chart">
            {[42, 58, 82, 95, 74, 48].map((h, i) => (
              <div key={i}>
                <span
                  style={{ height: `${h}%` }}
                  className={i < 2 ? "low" : i > 4 ? "rosebar" : ""}
                />
                <small>
                  {["<50", "50–59", "60–69", "70–79", "80–89", "90+"][i]}
                </small>
              </div>
            ))}
          </div>
        </Card>
        <Card className="risk-card">
          <div className="card-head">
            <div>
              <h2>Academic risk</h2>
              <p>Evidence-based indicators</p>
            </div>
          </div>
          <div className="risk-total">
            <strong>126</strong>
            <span>students need attention</span>
          </div>
          {[
            ["Attendance risk", 62, "moss"],
            ["Performance risk", 41, "rose"],
            ["Both indicators", 23, "olive"],
          ].map((r) => (
            <div className="risk-row" key={r[0]}>
              <span>
                <i className={`${r[2]}-bg`} />
                {r[0]}
              </span>
              <b>{r[1]}</b>
            </div>
          ))}
          <Button variant="outline">Review risk indicators</Button>
        </Card>
        <Card className="department-card">
          <div className="card-head">
            <div>
              <h2>Department comparison</h2>
              <p>Average score and attendance</p>
            </div>
          </div>
          {[
            ["Computer Science", 84, 91],
            ["Information Technology", 79, 88],
            ["Electronics", 76, 85],
            ["Mechanical", 73, 82],
          ].map((d) => (
            <div className="dept-row" key={d[0]}>
              <strong>{d[0]}</strong>
              <div>
                <span>Score {d[1]}%</span>
                <Progress value={d[1] as number} />
              </div>
              <div>
                <span>Attendance {d[2]}%</span>
                <Progress value={d[2] as number} tone="moss" />
              </div>
            </div>
          ))}
        </Card>
        <InsightCard />
      </div>
    </>
  )
}

function StudyPlan() {
  const [checked, setChecked] = useState<number[]>([0, 2])
  const [planRationale, setPlanRationale] = useState(
    "More time is allocated to Computer Networks before your exam on 24 June.",
  )
  const [regenerating, setRegenerating] = useState(false)
  const tasks = [
    ["Review subnetting fundamentals", "Computer Networks", "35 min", "High"],
    ["Practice 5 routing problems", "Computer Networks", "45 min", "High"],
    ["Revise B-tree operations", "Data Structures", "30 min", "Medium"],
    ["Read normalization notes", "Database Systems", "25 min", "Low"],
  ]
  const regenerate = async () => {
    if (regenerating) return
    setRegenerating(true)
    try {
      setPlanRationale(
        await askAI(
          "Regenerate my weekly study plan rationale and priorities.",
          "Student context: Computer Networks exam on 24 June; current focus areas are subnetting and routing protocols. Also studying Data Structures and Database Systems. Be concise and provide actionable priorities.",
        ),
      )
    } catch (error) {
      setPlanRationale(
        error instanceof Error ? error.message : "The AI assistant could not respond.",
      )
    } finally {
      setRegenerating(false)
    }
  }
  return (
    <>
      <PageHeader
        role="Student"
        active="AI study plan"
        action={{ text: regenerating ? "Regenerating…" : "Regenerate plan", onClick: regenerate }}
      />
      <div className="plan-grid">
        <Card className="plan-sidebar">
          <div className="ai-label">
            <Icon name="sparkle" />
            <span>PERSONALIZED PLAN</span>
          </div>
          <h2>Your week at a glance</h2>
          <p>
            Built from upcoming deadlines, exam dates, and current topic
            performance.
          </p>
          <div className="plan-ring">
            <div>
              <strong>72%</strong>
              <span>completed</span>
            </div>
          </div>
          <div className="plan-numbers">
            <div>
              <strong>18</strong>
              <span>Tasks done</span>
            </div>
            <div>
              <strong>7</strong>
              <span>Remaining</span>
            </div>
          </div>
          <div className="plan-note">
            <Icon name="sparkle" />
            <span>
              <strong>Plan rationale</strong>{planRationale}
            </span>
          </div>
        </Card>
        <Card className="daily-plan">
          <div className="week-nav">
            <button>
              <Icon name="chevron" />
            </button>
            <strong>17–23 June</strong>
            <button>
              <Icon name="chevron" />
            </button>
            <Button variant="outline">Today</Button>
          </div>
          <div className="day-tabs">
            {["MON 17", "TUE 18", "WED 19", "THU 20", "FRI 21"].map((d, i) => (
              <button className={i === 1 ? "active" : ""} key={d}>
                {d.split(" ")[0]}
                <strong>{d.split(" ")[1]}</strong>
                {i === 1 && <span />}
              </button>
            ))}
          </div>
          <div className="task-heading">
            <div>
              <h2>Tuesday’s focus</h2>
              <p>2 hr 15 min planned · 4 tasks</p>
            </div>
            <Badge tone="moss">High focus day</Badge>
          </div>
          {tasks.map((t, i) => (
            <button
              className={`task-row ${checked.includes(i) ? "done" : ""}`}
              onClick={() =>
                setChecked((v) =>
                  v.includes(i) ? v.filter((x) => x !== i) : [...v, i],
                )
              }
              key={t[0]}
            >
              <span className="task-check">
                {checked.includes(i) && <Icon name="check" size={15} />}
              </span>
              <div>
                <strong>{t[0]}</strong>
                <small>{t[1]}</small>
              </div>
              <span>
                <Icon name="clock" size={15} />
                {t[2]}
              </span>
              <Badge
                tone={
                  t[3] === "High"
                    ? "rose"
                    : t[3] === "Medium"
                      ? "warning"
                      : "neutral"
                }
              >
                {t[3]}
              </Badge>
              <span className="drag">⠿</span>
            </button>
          ))}
          <Button variant="ghost" icon="plus">
            Add personal task
          </Button>
        </Card>
      </div>
    </>
  )
}

function LearningStudio() {
  const [tab, setTab] = useState("Notes generator")
  const [generated, setGenerated] = useState(false)
  const [topic, setTopic] = useState("Routing protocols")
  const [detailLevel, setDetailLevel] = useState<
    "Quick summary" | "Study notes" | "In depth"
  >("Study notes")
  const [notes, setNotes] = useState("")
  const [generating, setGenerating] = useState(false)
  const generateNotes = async () => {
    if (generating) return
    setGenerating(true)
    try {
      setNotes(
        await askAI(
          `Create ${detailLevel.toLowerCase()} about ${topic}. Include key concepts, one example, and two practice questions.`,
          "Student learning context: Computer Networks (CS307). Keep the explanation accurate, concise, and suitable for exam preparation.",
        ),
      )
      setGenerated(true)
    } catch (error) {
      setNotes(error instanceof Error ? error.message : "The AI assistant could not respond.")
      setGenerated(true)
    } finally {
      setGenerating(false)
    }
  }
  return (
    <>
      <PageHeader role="Student" active="AI learning studio" />
      <div className="studio-tabs">
        <button
          className={tab === "Notes generator" ? "active" : ""}
          onClick={() => setTab("Notes generator")}
        >
          <Icon name="book" />
          Notes generator
        </button>
        <button
          className={tab === "Academic advisor" ? "active" : ""}
          onClick={() => setTab("Academic advisor")}
        >
          <Icon name="sparkle" />
          Academic advisor
        </button>
        <button
          className={tab === "AI chatbot" ? "active" : ""}
          onClick={() => setTab("AI chatbot")}
        >
          <Icon name="assignment" />
          AI chatbot
        </button>
      </div>
      {tab === "Notes generator" ? (
        <div className="studio-grid">
          <Card className="generator-form">
            <div className="ai-label">
              <Icon name="sparkle" />
              <span>AI NOTES GENERATOR</span>
            </div>
            <h2>What would you like to study?</h2>
            <label>
              Subject
              <select>
                <option>Computer Networks (CS307)</option>
                <option>Data Structures (CS301)</option>
              </select>
            </label>
            <label>
              Topic
              <input value={topic} onChange={(event) => setTopic(event.target.value)} />
            </label>
            <label>
              Detail level
              <div className="segment">
                {(["Quick summary", "Study notes", "In depth"] as const).map(
                  (level) => (
                    <button
                      type="button"
                      className={detailLevel === level ? "active" : ""}
                      onClick={() => setDetailLevel(level)}
                      key={level}
                    >
                      {level}
                    </button>
                  ),
                )}
              </div>
            </label>
            <label>
              Include
              <div className="check-grid">
                <span>
                  <input type="checkbox" defaultChecked />
                  Key concepts
                </span>
                <span>
                  <input type="checkbox" defaultChecked />
                  Examples
                </span>
                <span>
                  <input type="checkbox" defaultChecked />
                  Definitions
                </span>
                <span>
                  <input type="checkbox" defaultChecked />
                  Practice questions
                </span>
              </div>
            </label>
            <Button icon="sparkle" onClick={generateNotes}>
              {generating ? "Generating…" : "Generate study notes"}
            </Button>
            <small className="ai-disclaimer">
              AI-assisted learning material. Verify important details against
              official course resources.
            </small>
          </Card>
          <Card className={`generated-notes ${generated ? "revealed" : ""}`}>
            {generated ? (
              <>
                <div className="notes-head">
                  <div>
                    <Badge tone="rose">AI-assisted</Badge>
                    <h2>{topic}</h2>
                    <p>Computer Networks · Generated just now</p>
                  </div>
                  <div>
                    <Button variant="ghost">Edit</Button>
                    <Button variant="outline">Save notes</Button>
                  </div>
                </div>
                <div className="notes-content">
                  <h3>AI study notes</h3>
                  <AIResponse text={notes} />
                </div>
              </>
            ) : (
              <div className="empty-state">
                <span>
                  <Icon name="sparkle" size={28} />
                </span>
                <h2>Your notes will appear here</h2>
                <p>
                  Select a subject and topic, then generate structured learning
                  material.
                </p>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <Advisor tab={tab} />
      )}
    </>
  )
}

function Advisor({ tab }: { tab: string }) {
  const [question, setQuestion] = useState("")
  const [askedQuestion, setAskedQuestion] = useState(
    "What should I focus on before my Computer Networks exam?",
  )
  const [answer, setAnswer] = useState(
    "Prioritize subnetting and routing protocols. Your quiz performance suggests you understand the OSI model well, but could benefit from more applied practice in these two areas.",
  )
  const [loading, setLoading] = useState(false)
  const ask = async () => {
    const nextQuestion = question.trim()
    if (!nextQuestion || loading) return
    setQuestion("")
    setAskedQuestion(nextQuestion)
    setLoading(true)
    try {
      setAnswer(
        await askAI(
          nextQuestion,
          "Student context: Computer Networks is an active subject. Provide study guidance, not an official grade or institutional decision.",
        ),
      )
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "The AI assistant could not respond.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <Card className="chat-card">
      <div className="chat-head">
        <span className="chat-avatar">
          <Icon name="sparkle" />
        </span>
        <div>
          <strong>
            {tab === "AI chatbot" ? "AICOS Assistant" : "Academic Advisor"}
          </strong>
          <small>
            <i /> Available · Uses your permitted academic context
          </small>
        </div>
        <Button variant="ghost">New conversation</Button>
      </div>
      <div className="chat-body">
        <div className="chat-intro">
          <span>
            <Icon name="sparkle" />
          </span>
          <h2>How can I support your learning?</h2>
          <p>
            Ask about course concepts, performance patterns, or ways to prepare
            for upcoming work.
          </p>
          <div>
            {[
              "What should I focus on this week?",
              "Explain my attendance trend",
              "Help me prepare for CS307",
            ].map((suggestion) => (
              <button key={suggestion} onClick={() => setQuestion(suggestion)}>
                {suggestion}
              </button>
            ))}
          </div>
        </div>
        <div className="message user">{askedQuestion}</div>
        <div className="message assistant">
          <strong>Based on your recent topic performance</strong>
          {loading ? <p>Thinking…</p> : <AIResponse text={answer} />}
          <small>
            AI-assisted suggestion · Based on your permitted academic data
          </small>
        </div>
      </div>
      <div className="chat-input">
        <button className="icon-btn">
          <Icon name="plus" />
        </button>
        <input
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") void ask()
          }}
          placeholder="Ask an academic question…"
        />
        <button
          className="send-btn"
          onClick={ask}
          disabled={!question.trim() || loading}
        >
          <Icon name="arrow" />
        </button>
      </div>
    </Card>
  )
}

type EvaluationAttachment = {
  name: string
  type: string
  size: string
}

function AIEvaluationWorkspace({ role }: { role: "Faculty" | "Student" }) {
  const [prompt, setPrompt] = useState("")
  const [attachments, setAttachments] = useState<EvaluationAttachment[]>([])
  const [evaluated, setEvaluated] = useState(false)
  const [loading, setLoading] = useState(false)
  const [finalized, setFinalized] = useState(false)
  const [finalScore, setFinalScore] = useState("16")
  const [evaluationAnswer, setEvaluationAnswer] = useState("")
  const [conversationTitle, setConversationTitle] = useState(
    role === "Faculty" ? "Graph traversal submission" : "Cloud computing notes",
  )
  const addFiles = (files: FileList | null) => {
    if (!files) return
    const incoming = Array.from(files).map((file) => ({
      name: file.name,
      type: file.type.startsWith("image/") ? "Image" : "Document",
      size:
        file.size > 1024 * 1024
          ? `${(file.size / 1024 / 1024).toFixed(1)} MB`
          : `${Math.max(1, Math.round(file.size / 1024))} KB`,
    }))
    setAttachments((current) => [...current, ...incoming].slice(0, 6))
  }
  const evaluate = async () => {
    if (!prompt.trim() && !attachments.length) return
    setLoading(true)
    setEvaluated(false)
    setFinalized(false)
    try {
      const request =
        prompt.trim() ||
        "Review the attached work and provide an evidence-based evaluation."
      setEvaluationAnswer(
        await askAI(
          request,
          `${role === "Faculty" ? "Faculty" : "Student"} evaluation context. ${
            attachments.length
              ? `The user attached: ${attachments.map((file) => file.name).join(", ")}.`
              : "No file contents are available; evaluate only the text provided."
          } Provide formative feedback and never assign an official grade automatically.`,
        ),
      )
      setLoading(false)
      setEvaluated(true)
      setConversationTitle(
        role === "Faculty"
          ? "Graph traversal evaluation"
          : "Self-review · Cloud computing",
      )
    } catch (error) {
      setLoading(false)
      setEvaluationAnswer(
        error instanceof Error ? error.message : "The AI assistant could not respond.",
      )
      setEvaluated(true)
    }
  }
  const reset = () => {
    setPrompt("")
    setAttachments([])
    setEvaluated(false)
    setLoading(false)
    setFinalized(false)
    setEvaluationAnswer("")
    setConversationTitle("New evaluation")
  }
  const suggestions =
    role === "Faculty"
      ? [
          "Evaluate against the assignment rubric",
          "Check reasoning and factual accuracy",
          "Draft constructive student feedback",
        ]
      : [
          "Review my answer for conceptual gaps",
          "Evaluate these notes for exam readiness",
          "Create improvement questions",
        ]
  return (
    <div className="ai-evaluation-page">
      <PageHeader
        role={role}
        active="AI Evaluation"
        action={{ text: "New evaluation", onClick: reset }}
      />
      <div className="evaluation-shell">
        <aside className="evaluation-history">
          <div className="evaluation-history-head">
            <span>RECENT EVALUATIONS</span>
            <button onClick={reset}>
              <Icon name="plus" size={15} />
            </button>
          </div>
          <button className="evaluation-history-item active">
            <span>
              <Icon name="assignment" />
            </span>
            <div>
              <strong>{conversationTitle}</strong>
              <small>Just now · {attachments.length || 1} attachment</small>
            </div>
          </button>
          {(role === "Faculty"
            ? [
                ["Database normalization", "Riya Mehta · Yesterday"],
                ["Network topology report", "Dev Patel · 16 June"],
                ["Algorithm analysis", "Sara Khan · 14 June"],
              ]
            : [
                ["Routing protocol notes", "Yesterday"],
                ["Machine learning answer", "16 June"],
                ["Project report review", "12 June"],
              ]
          ).map((item) => (
            <button className="evaluation-history-item" key={item[0]}>
              <span>
                <Icon name="report" />
              </span>
              <div>
                <strong>{item[0]}</strong>
                <small>{item[1]}</small>
              </div>
            </button>
          ))}
          <div className="evaluation-privacy">
            <Icon name="eye" />
            <span>
              <strong>Private workspace</strong>
              Files are evaluated only within your authorized academic context.
            </span>
          </div>
        </aside>
        <Card className="evaluation-workspace">
          <div className="evaluation-toolbar">
            <div className="evaluation-agent">
              <span>
                <Icon name="sparkle" />
              </span>
              <div>
                <strong>AICOS Evaluation Assistant</strong>
                <small>
                  <i /> Ready to review documents, images, or text
                </small>
              </div>
            </div>
            <div className="evaluation-context-controls">
              {role === "Faculty" ? (
                <>
                  <select aria-label="Evaluation subject">
                    <option>Data Structures · BCS701</option>
                    <option>Cloud Computing · BCS703</option>
                  </select>
                  <select aria-label="Evaluation assignment">
                    <option>Graph Traversal · 20 marks</option>
                    <option>Cloud Architecture · 25 marks</option>
                  </select>
                </>
              ) : (
                <>
                  <select aria-label="Evaluation subject">
                    <option>Cloud Computing · BCS703</option>
                    <option>Machine Learning · BCS701</option>
                  </select>
                  <Badge tone="rose">Self-review only</Badge>
                </>
              )}
            </div>
          </div>
          <div className="evaluation-chat">
            {!evaluated && !loading && (
              <div className="evaluation-welcome">
                <span className="evaluation-spark">
                  <Icon name="sparkle" size={27} />
                </span>
                <h2>
                  {role === "Faculty"
                    ? "What would you like to evaluate?"
                    : "Review your work before you submit"}
                </h2>
                <p>
                  {role === "Faculty"
                    ? "Upload a student submission, image, or supporting document, then tell the assistant what evidence to assess."
                    : "Upload your own notes, answer, report, or image and ask for formative feedback. This does not create an official grade."}
                </p>
                <div className="evaluation-suggestions">
                  {suggestions.map((suggestion) => (
                    <button
                      onClick={() => setPrompt(suggestion)}
                      key={suggestion}
                    >
                      <Icon name="sparkle" size={14} />
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {(evaluated || loading) && (
              <div className="evaluation-conversation">
                <div className="evaluation-message user-message">
                  <div className="evaluation-message-files">
                    {attachments.map((file) => (
                      <span key={`${file.name}-${file.size}`}>
                        <Icon name={file.type === "Image" ? "eye" : "report"} />
                        <b>{file.name}</b>
                        <small>
                          {file.type} · {file.size}
                        </small>
                      </span>
                    ))}
                  </div>
                  <p>
                    {prompt ||
                      "Review the attached work and provide an evidence-based evaluation."}
                  </p>
                </div>
                {loading ? (
                  <div className="evaluation-message ai-message evaluation-loading">
                    <span className="evaluation-ai-avatar">
                      <Icon name="sparkle" />
                    </span>
                    <div>
                      <i />
                      <i />
                      <i />
                      <small>
                        Reading the submitted material and comparing evidence…
                      </small>
                    </div>
                  </div>
                ) : (
                  <div className="evaluation-message ai-message">
                    <span className="evaluation-ai-avatar">
                      <Icon name="sparkle" />
                    </span>
                    <div className="evaluation-response">
                      <div className="evaluation-response-head">
                        <div>
                          <Badge tone="rose">AI-generated suggestion</Badge>
                          <h3>Evaluation complete</h3>
                        </div>
                        <div className="evaluation-confidence">
                          <span>Confidence</span>
                          <strong>86%</strong>
                        </div>
                      </div>
                      <AIResponse text={evaluationAnswer} />
                      <div className="evaluation-score-row">
                        <div>
                          <span>AI-suggested score</span>
                          <strong>
                            16 <small>/ 20</small>
                          </strong>
                          <em>Suggestion only</em>
                        </div>
                        <div className="evaluation-score-reason">
                          <span>Rubric evidence</span>
                          <Progress value={80} tone="olive" />
                          <small>
                            Concepts 8/10 · Application 5/6 · Clarity 3/4
                          </small>
                        </div>
                      </div>
                      <div className="evaluation-findings">
                        <div className="finding strength">
                          <span>
                            <Icon name="check" />
                          </span>
                          <div>
                            <strong>Strengths</strong>
                            <ul>
                              <li>
                                Correct traversal sequence and clear examples
                              </li>
                              <li>Good comparison of BFS and DFS use cases</li>
                            </ul>
                          </div>
                        </div>
                        <div className="finding improve">
                          <span>
                            <Icon name="warning" />
                          </span>
                          <div>
                            <strong>Needs improvement</strong>
                            <ul>
                              <li>Clarify space complexity assumptions</li>
                              <li>
                                Add handling for disconnected graph components
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                      <div className="evaluation-feedback-draft">
                        <span>Suggested feedback</span>
                        <p>
                          Strong conceptual work with appropriate examples.
                          Revise the complexity discussion and explain how your
                          algorithm handles disconnected graphs.
                        </p>
                        <button>
                          <Icon name="assignment" size={14} /> Copy feedback
                        </button>
                      </div>
                      {role === "Faculty" ? (
                        <div className="faculty-decision">
                          <div>
                            <span>Official faculty decision</span>
                            <strong>Set the final score independently</strong>
                            <small>
                              The AI suggestion is never applied automatically.
                            </small>
                          </div>
                          <label>
                            Final score
                            <span>
                              <input
                                value={finalScore}
                                onChange={(event) =>
                                  setFinalScore(event.target.value)
                                }
                              />
                              <b>/ 20</b>
                            </span>
                          </label>
                          <Button
                            icon="check"
                            onClick={() => setFinalized(true)}
                          >
                            Finalize review
                          </Button>
                        </div>
                      ) : (
                        <div className="student-evaluation-note">
                          <Icon name="warning" />
                          <span>
                            <strong>Formative AI feedback</strong>This
                            self-review is not an official course evaluation or
                            published grade. Use it to improve your work before
                            submission.
                          </span>
                        </div>
                      )}
                      {finalized && (
                        <div className="evaluation-finalized">
                          <Icon name="check" />
                          <span>
                            <strong>Faculty review finalized</strong>Final score
                            recorded as {finalScore}/20. Publishing remains a
                            separate faculty action.
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
          <div className="evaluation-composer">
            {attachments.length > 0 && (
              <div className="composer-attachments">
                {attachments.map((file, index) => (
                  <span key={`${file.name}-${index}`}>
                    <Icon name={file.type === "Image" ? "eye" : "report"} />
                    <b>{file.name}</b>
                    <small>{file.size}</small>
                    <button
                      onClick={() =>
                        setAttachments((current) =>
                          current.filter((_, itemIndex) => itemIndex !== index),
                        )
                      }
                    >
                      <Icon name="close" size={13} />
                    </button>
                  </span>
                ))}
              </div>
            )}
            <div className="evaluation-input-row">
              <label
                className="evaluation-upload"
                title="Upload documents or images"
              >
                <Icon name="plus" />
                <input
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg,.webp"
                  onChange={(event) => {
                    addFiles(event.target.files)
                    event.target.value = ""
                  }}
                />
              </label>
              <textarea
                value={prompt}
                onChange={(event) => setPrompt(event.target.value)}
                placeholder={
                  role === "Faculty"
                    ? "Ask the AI to evaluate this work against specific criteria…"
                    : "Ask for feedback on your notes, answer, image, or document…"
                }
              />
              <button
                className="evaluation-send"
                onClick={evaluate}
                disabled={loading || (!prompt.trim() && !attachments.length)}
                aria-label="Evaluate"
              >
                <Icon name="arrow" />
              </button>
            </div>
            <div className="evaluation-composer-foot">
              <span>
                <Icon name="plus" size={13} /> PDF, DOCX, TXT, PNG or JPG · Up
                to 6 files
              </span>
              <span>
                AI can make mistakes. Review evidence before making academic
                decisions.
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}

function PlacementReadinessPage() {
  const [month, setMonth] = useState<"This month" | "Next month">("This month")
  const [question, setQuestion] = useState("")
  const [askedQuestion, setAskedQuestion] = useState(
    "How should I prepare for the upcoming Infosys campus drive?",
  )
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState(
    "You meet the published academic eligibility criteria. Focus on data structures, SQL, object-oriented programming, timed aptitude practice, and measurable outcomes in your project profile.",
  )
  const ask = async () => {
    const nextQuestion = question.trim()
    if (!nextQuestion || loading) return
    setAskedQuestion(nextQuestion)
    setQuestion("")
    setLoading(true)
    try {
      setAnswer(
        await askAI(
          nextQuestion,
          "Student placement context: CGPA 8.42, active enrollment, Computer Science and Design Engineering. Give preparation guidance and clearly distinguish published eligibility from advice.",
        ),
      )
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "The AI assistant could not respond.")
    } finally {
      setLoading(false)
    }
  }
  const activities =
    month === "This month"
      ? [
          {
            date: "22",
            month: "JUN",
            title: "Resume review clinic",
            detail: "Career Services · Seminar Hall 2",
            time: "2:00–4:00 PM",
            type: "Workshop",
          },
          {
            date: "25",
            month: "JUN",
            title: "Aptitude mock assessment",
            detail: "Online · 60 minutes",
            time: "10:00 AM",
            type: "Assessment",
          },
          {
            date: "28",
            month: "JUN",
            title: "Alumni interview practice",
            detail: "CSD Department · Room 304",
            time: "11:30 AM",
            type: "Practice",
          },
        ]
      : [
          {
            date: "04",
            month: "JUL",
            title: "Infosys pre-placement talk",
            detail: "Main Auditorium",
            time: "3:00 PM",
            type: "Company event",
          },
          {
            date: "08",
            month: "JUL",
            title: "Technical coding round",
            detail: "Placement Lab · Block C",
            time: "9:30 AM",
            type: "Campus drive",
          },
          {
            date: "12",
            month: "JUL",
            title: "Group discussion workshop",
            detail: "Career Services Centre",
            time: "1:00 PM",
            type: "Workshop",
          },
        ]
  return (
    <div className="placement-page">
      <PageHeader role="Student" active="Placement Readiness" />
      <div className="placement-summary">
        <Card className="placement-score-card">
          <div className="placement-ring">
            <div>
              <strong>72%</strong>
              <span>estimated</span>
            </div>
          </div>
          <div>
            <span>PLACEMENT READINESS</span>
            <h2>Developing well</h2>
            <p>
              Based on your permitted academic, skills, project, and preparation
              records.
            </p>
          </div>
          <Badge tone="moss">Estimate, not a guarantee</Badge>
        </Card>
        <Card className="placement-mini-card">
          <span className="summary-icon sage">
            <Icon name="check" />
          </span>
          <div>
            <span>Profile strength</span>
            <strong>8 of 10</strong>
            <small>Projects need more detail</small>
          </div>
        </Card>
        <Card className="placement-mini-card">
          <span className="summary-icon rose">
            <Icon name="assignment" />
          </span>
          <div>
            <span>Preparation tasks</span>
            <strong>4 pending</strong>
            <small>2 due this week</small>
          </div>
        </Card>
      </div>
      <Card className="placement-alert">
        <span className="placement-company-mark">IN</span>
        <div>
          <div className="placement-alert-title">
            <Badge tone="rose">New placement notice</Badge>
            <span>Posted by Career Services · 1 hour ago</span>
          </div>
          <h2>Infosys campus recruitment drive</h2>
          <p>
            Pre-placement talk on 4 July followed by aptitude and technical
            rounds. Eligible students must register before 30 June.
          </p>
          <div className="placement-alert-meta">
            <span>
              <Icon name="calendar" /> 4–8 July 2025
            </span>
            <span>
              <Icon name="people" /> BE · CSD, ISE, ECE
            </span>
            <span>
              <Icon name="check" /> Minimum CGPA: 7.0
            </span>
          </div>
        </div>
        <div className="placement-alert-actions">
          <Button variant="outline">View notice</Button>
          <Button>Register interest</Button>
        </div>
      </Card>
      <div className="placement-grid">
        <Card className="placement-chat-card">
          <div className="placement-chat-head">
            <span>
              <Icon name="sparkle" />
            </span>
            <div>
              <strong>AICOS Placement Advisor</strong>
              <small>
                <i /> Uses your permitted academic and placement profile
              </small>
            </div>
            <Badge tone="rose">AI-assisted</Badge>
          </div>
          <div className="placement-chat-body">
            <div className="placement-chat-intro">
              <h2>Prepare with context, not guesswork</h2>
              <p>
                Ask about campus opportunities, resumes, interviews, skills,
                projects, or your preparation plan.
              </p>
              <div>
                {[
                  "Am I eligible for the Infosys drive?",
                  "What skills should I improve first?",
                  "Create a 7-day interview plan",
                ].map((item) => (
                  <button key={item} onClick={() => setQuestion(item)}>
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <div className="placement-message student">{askedQuestion}</div>
            <div className="placement-message advisor">
              <span className="evaluation-ai-avatar">
                <Icon name="sparkle" />
              </span>
              {loading ? (
                <div className="placement-thinking">
                  <i />
                  <i />
                  <i />
                  <small>Reviewing your placement profile…</small>
                </div>
              ) : (
                <div>
                  <AIResponse text={answer} />
                  <div className="placement-answer-evidence">
                    <span>
                      <Icon name="check" /> Eligibility notice
                    </span>
                    <span>
                      <Icon name="chart" /> Academic profile
                    </span>
                    <span>
                      <Icon name="report" /> Skills record
                    </span>
                  </div>
                  <small>
                    AI-assisted guidance · Verify final eligibility with Career
                    Services.
                  </small>
                </div>
              )}
            </div>
          </div>
          <div className="placement-chat-input">
            <button className="icon-btn">
              <Icon name="plus" />
            </button>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask a placement or career preparation question…"
            />
            <button
              className="evaluation-send"
              onClick={ask}
              disabled={!question.trim() || loading}
            >
              <Icon name="arrow" />
            </button>
          </div>
        </Card>
        <div className="placement-side">
          <Card className="placement-activities">
            <div className="placement-side-head">
              <div>
                <h2>Placement activities</h2>
                <p>Workshops, assessments, and drives</p>
              </div>
              <div className="month-switch">
                <button
                  className={month === "This month" ? "active" : ""}
                  onClick={() => setMonth("This month")}
                >
                  This month
                </button>
                <button
                  className={month === "Next month" ? "active" : ""}
                  onClick={() => setMonth("Next month")}
                >
                  Next
                </button>
              </div>
            </div>
            {activities.map((activity) => (
              <div className="placement-activity-row" key={activity.title}>
                <span className="placement-date">
                  <strong>{activity.date}</strong>
                  <small>{activity.month}</small>
                </span>
                <div>
                  <Badge
                    tone={activity.type === "Campus drive" ? "rose" : "neutral"}
                  >
                    {activity.type}
                  </Badge>
                  <strong>{activity.title}</strong>
                  <small>
                    {activity.detail} · {activity.time}
                  </small>
                </div>
                <button>
                  <Icon name="chevron" />
                </button>
              </div>
            ))}
            <Button variant="ghost">View placement calendar</Button>
          </Card>
          <Card className="placement-notifications">
            <div className="placement-side-head">
              <div>
                <h2>Career notifications</h2>
                <p>From your institution</p>
              </div>
              <Badge tone="rose">3 new</Badge>
            </div>
            {[
              [
                "Registration closing soon",
                "Infosys drive · Due 30 June",
                "rose",
              ],
              [
                "Resume clinic confirmed",
                "Your slot is 22 June at 2:30 PM",
                "sage",
              ],
              [
                "New internship opportunity",
                "Product Design Intern · Apply by 5 July",
                "sand",
              ],
            ].map((notice) => (
              <button key={notice[0]}>
                <i className={notice[2]} />
                <span>
                  <strong>{notice[0]}</strong>
                  <small>{notice[1]}</small>
                </span>
                <Icon name="chevron" />
              </button>
            ))}
          </Card>
        </div>
      </div>
    </div>
  )
}

function AdminInstitutionAssistant() {
  const [question, setQuestion] = useState("")
  const [askedQuestion, setAskedQuestion] = useState(
    "Which academic areas need administrative attention this week?",
  )
  const [loading, setLoading] = useState(false)
  const [answer, setAnswer] = useState(
    "Three areas currently warrant attention: first-year attendance decline, examination results awaiting approval, and a missing curriculum configuration. Review the underlying records before taking action.",
  )
  const ask = async () => {
    const nextQuestion = question.trim()
    if (!nextQuestion || loading) return
    setAskedQuestion(nextQuestion)
    setQuestion("")
    setLoading(true)
    try {
      setAnswer(
        await askAI(
          nextQuestion,
          "Administrator context: 3,842 students, 24 active programs, academic session 2024-25 semester 2. Summarize and recommend review steps only; do not claim access to live institutional records.",
        ),
      )
    } catch (error) {
      setAnswer(error instanceof Error ? error.message : "The AI assistant could not respond.")
    } finally {
      setLoading(false)
    }
  }
  return (
    <div className="admin-assistant-page">
      <PageHeader
        role="Admin"
        active="AI Institution Assistant"
        action={{ text: "New conversation" }}
      />
      <div className="admin-assistant-summary">
        <Card>
          <span className="summary-icon sage">
            <Icon name="people" />
          </span>
          <div>
            <span>Institution context</span>
            <strong>3,842 students</strong>
            <small>24 active programs</small>
          </div>
        </Card>
        <Card>
          <span className="summary-icon sand">
            <Icon name="calendar" />
          </span>
          <div>
            <span>Current session</span>
            <strong>2024–25</strong>
            <small>Semester 2 in progress</small>
          </div>
        </Card>
        <Card>
          <span className="summary-icon rose">
            <Icon name="warning" />
          </span>
          <div>
            <span>Needs review</span>
            <strong>12 items</strong>
            <small>Across academic operations</small>
          </div>
        </Card>
      </div>
      <div className="admin-assistant-shell">
        <aside className="admin-assistant-prompts">
          <div className="admin-prompt-head">
            <span>
              <Icon name="sparkle" />
            </span>
            <div>
              <strong>Ask about your institution</strong>
              <small>Permission-aware summaries</small>
            </div>
          </div>
          {[
            [
              "Academic health",
              "Summarize attendance and performance risks",
              "chart",
            ],
            [
              "Operations",
              "What administrative work is overdue?",
              "assignment",
            ],
            ["Faculty capacity", "Show faculty workload concerns", "people"],
            ["Curriculum", "Find missing curriculum configurations", "book"],
            ["Reports", "Prepare a weekly leadership summary", "report"],
          ].map((item) => (
            <button key={item[0]} onClick={() => setQuestion(item[1])}>
              <span>
                <Icon name={item[2] as IconName} />
              </span>
              <div>
                <strong>{item[0]}</strong>
                <small>{item[1]}</small>
              </div>
              <Icon name="chevron" />
            </button>
          ))}
          <div className="admin-assistant-safety">
            <Icon name="warning" />
            <span>
              <strong>Review before action</strong>The assistant can summarize
              and recommend. It cannot alter official records without an
              authorized workflow.
            </span>
          </div>
        </aside>
        <Card className="admin-chat-card">
          <div className="admin-chat-head">
            <div className="evaluation-agent">
              <span>
                <Icon name="sparkle" />
              </span>
              <div>
                <strong>AICOS Institution Assistant</strong>
                <small>
                  <i /> Connected to permitted institutional context
                </small>
              </div>
            </div>
            <div>
              <Badge tone="moss">Admin access</Badge>
              <button className="icon-btn">
                <Icon name="more" />
              </button>
            </div>
          </div>
          <div className="admin-chat-body">
            <div className="admin-chat-date">TODAY</div>
            <div className="admin-message user">{askedQuestion}</div>
            <div className="admin-message assistant">
              <span className="evaluation-ai-avatar">
                <Icon name="sparkle" />
              </span>
              {loading ? (
                <div className="placement-thinking">
                  <i />
                  <i />
                  <i />
                  <small>Reviewing authorized institution data…</small>
                </div>
              ) : (
                <div>
                  <AIResponse text={answer} />
                  <div className="institution-finding high">
                    <span>
                      <Icon name="warning" />
                    </span>
                    <div>
                      <strong>First-year attendance decline</strong>
                      <p>
                        Three sections are down 6.4% across four weeks. 62
                        students are below the configured attendance threshold.
                      </p>
                      <button>
                        Open attendance analytics{" "}
                        <Icon name="arrow" size={13} />
                      </button>
                    </div>
                    <Badge tone="rose">High priority</Badge>
                  </div>
                  <div className="institution-finding medium">
                    <span>
                      <Icon name="assignment" />
                    </span>
                    <div>
                      <strong>Results awaiting approval</strong>
                      <p>
                        Seven examination result sets are reviewed but remain
                        unpublished across CSD and ISE.
                      </p>
                      <button>
                        Review result workflow <Icon name="arrow" size={13} />
                      </button>
                    </div>
                    <Badge tone="warning">Due soon</Badge>
                  </div>
                  <div className="institution-finding low">
                    <span>
                      <Icon name="book" />
                    </span>
                    <div>
                      <strong>Curriculum configuration gap</strong>
                      <p>
                        The 2025 B.Arch admission batch has no Semester 2
                        elective group configured.
                      </p>
                      <button>
                        Open curriculum setup <Icon name="arrow" size={13} />
                      </button>
                    </div>
                    <Badge tone="neutral">Configuration</Badge>
                  </div>
                  <div className="admin-recommendation">
                    <strong>Suggested sequence</strong>
                    <ol>
                      <li>
                        Ask department coordinators to verify first-year
                        attendance records.
                      </li>
                      <li>
                        Complete pending result approvals before Friday’s
                        publication window.
                      </li>
                      <li>
                        Assign the B.Arch curriculum gap to Academic Records.
                      </li>
                    </ol>
                  </div>
                  <small className="admin-answer-note">
                    AI-generated summary · Sources: attendance, results
                    workflow, and curriculum configuration · Updated 10 minutes
                    ago
                  </small>
                </div>
              )}
            </div>
          </div>
          <div className="admin-chat-composer">
            <button className="icon-btn">
              <Icon name="plus" />
            </button>
            <textarea
              value={question}
              onChange={(event) => setQuestion(event.target.value)}
              placeholder="Ask about attendance, performance, faculty, curricula, reports, or workflows…"
            />
            <button
              className="evaluation-send"
              onClick={ask}
              disabled={!question.trim() || loading}
            >
              <Icon name="arrow" />
            </button>
          </div>
          <div className="admin-chat-foot">
            <Icon name="warning" size={13} /> Responses follow your role
            permissions. Verify recommendations before changing institutional
            records.
          </div>
        </Card>
      </div>
    </div>
  )
}

function DesignSystem() {
  return (
    <>
      <PageHeader role="Admin" active="Design system" />
      <div className="ds-grid">
        <Card className="ds-colors">
          <div className="card-head">
            <div>
              <h2>Vintage Garden palette</h2>
              <p>Product color tokens</p>
            </div>
          </div>
          <div className="swatches">
            {[
              ["Cream", "cream", "#FEFBE0"],
              ["Sand", "sand", "#E6D2B9"],
              ["Mocha", "mocha", "#B08F7A"],
              ["Chocolate", "chocolate", "#79513E"],
              ["Espresso", "espresso", "#6B3B13"],
              ["Blush", "blush", "#F4BFC9"],
              ["Dusty Rose", "dusty", "#CB8793"],
              ["Mauve", "mauve", "#A7626B"],
              ["Light Sage", "light-sage", "#E8E8B8"],
              ["Meadow", "meadow", "#ACAD71"],
              ["Olive", "olive", "#9F9752"],
              ["Moss", "moss", "#706C3E"],
            ].map((c) => (
              <div key={c[0]}>
                <span className={`swatch ${c[1]}`} />
                <strong>{c[0]}</strong>
                <small>{c[2]}</small>
              </div>
            ))}
          </div>
        </Card>
        <Card>
          <div className="card-head">
            <div>
              <h2>Buttons</h2>
              <p>Actions and hierarchy</p>
            </div>
          </div>
          <div className="component-row">
            <Button>Primary action</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Text button</Button>
          </div>
          <div className="component-row">
            <button className="btn btn-primary" disabled>
              Disabled
            </button>
            <Button icon="plus">With icon</Button>
            <button className="btn btn-primary loading">Loading</button>
          </div>
        </Card>
        <Card>
          <div className="card-head">
            <div>
              <h2>Status badges</h2>
              <p>Semantic states use color and text</p>
            </div>
          </div>
          <div className="component-row wrap">
            <Badge tone="warning">Draft</Badge>
            <Badge tone="success">Published</Badge>
            <Badge tone="moss">Submitted</Badge>
            <Badge tone="rose">Late</Badge>
            <Badge tone="warning">Under evaluation</Badge>
            <Badge tone="success">Evaluated</Badge>
            <Badge tone="success">Verified</Badge>
            <Badge tone="warning">Needs review</Badge>
            <Badge tone="neutral">Unable to verify</Badge>
          </div>
        </Card>
        <Card>
          <div className="card-head">
            <div>
              <h2>Form controls</h2>
              <p>Inputs, selection, and validation</p>
            </div>
          </div>
          <div className="form-demo">
            <label>
              Email address
              <input placeholder="name@college.edu" />
            </label>
            <label>
              Department
              <select>
                <option>Computer Science</option>
              </select>
            </label>
            <label className="error">
              Student ID
              <input defaultValue="AIC-" />
              <small>Enter a complete student ID.</small>
            </label>
          </div>
        </Card>
        <Card>
          <div className="card-head">
            <div>
              <h2>Feedback and progress</h2>
              <p>Clear, accessible system states</p>
            </div>
          </div>
          <div className="feedback-demo">
            <div className="inline-alert success">
              <Icon name="check" />
              <span>
                <strong>Changes saved</strong>Your updates are now visible.
              </span>
            </div>
            <div className="inline-alert warning">
              <Icon name="warning" />
              <span>
                <strong>Review required</strong>Two records need more
                information.
              </span>
            </div>
            <Progress value={68} />
            <Progress value={42} tone="rose" />
          </div>
        </Card>
      </div>
    </>
  )
}

function App() {
  const [authenticated, setAuthenticated] = useState(false)
  const [authChecking, setAuthChecking] = useState(true)
  const [role, setRoleState] = useState<Role>("Admin")
  const [active, setActive] = useState("Overview")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [facultyRecords, setFacultyRecords] = useState(initialFacultyRecords)
  const setRole = (r: Role) => {
    setRoleState(r)
    setActive("Overview")
  }
  useEffect(() => {
    fetch("/api/auth/me", { credentials: "include" })
      .then(async (response) => {
        if (!response.ok) return
        const data = (await response.json()) as { user?: { role?: Role } }
        if (data.user?.role) {
          setRole(data.user.role)
          setAuthenticated(true)
        }
      })
      .catch(() => undefined)
      .finally(() => setAuthChecking(false))
  }, [])
  const content = useMemo(() => {
    if (active === "Design system") return <DesignSystem />
    if (
      active === "Profile" ||
      active === "Edit Profile" ||
      active === "Account Settings"
    )
      return (
        <ProfilePage
          key={active}
          role={role}
          initialEdit={active === "Edit Profile"}
        />
      )
    if (active === "Overview")
      return role === "Admin" ? (
        <AdminOverview
          setActive={setActive}
          facultyCount={
            186 + facultyRecords.length - initialFacultyRecords.length
          }
        />
      ) : role === "Faculty" ? (
        <FacultyOverview setActive={setActive} />
      ) : (
        <StudentOverview setActive={setActive} />
      )
    if (active === "Faculty" && role === "Admin")
      return (
        <FacultyManagement
          records={facultyRecords}
          setRecords={setFacultyRecords}
        />
      )
    if (active === "Students") return <Directory role={role} />
    if (active === "Enrollments" && role === "Admin")
      return <AdminEnrollments />
    if (active === "Reports & audit" && role === "Admin")
      return <ReportsAuditPage />
    if (active === "My classes" && role === "Faculty")
      return <FacultyClassesPage onNavigate={setActive} />
    if (active === "Attendance" && role === "Faculty")
      return <FacultyAttendancePage />
    if (active === "Assignments") return <Assignments role={role} />
    if (active === "Attendance" && role === "Student")
      return <StudentAttendance />
    if (active === "My subjects" && role === "Student")
      return <MyAllocatedSubjects />
    if (active === "Academic configuration" && role === "Admin")
      return <AcademicConfiguration />
    if (active === "Placement readiness" && role === "Student")
      return <PlacementReadinessPage />
    if (active === "AI institution assistant" && role === "Admin")
      return <AdminInstitutionAssistant />
    if (active === "Exams & results" && role === "Faculty")
      return <ExamsResultsPage role="Faculty" />
    if (active === "Exams & results" && role === "Student")
      return <ExamsResultsPage role="Student" />
    if (active === "Notifications")
      return <NotificationsPage role={role} onNavigate={setActive} />
    if (active === "Analytics" || active === "Class intelligence")
      return <Analytics role={role} />
    if (active === "AI study plan") return <StudyPlan />
    if (
      active === "AI evaluation" &&
      (role === "Faculty" || role === "Student")
    )
      return <AIEvaluationWorkspace role={role} />
    if (active === "AI learning studio" && role === "Student")
      return <LearningStudio />
    return <Directory role={role} />
  }, [active, role, facultyRecords])
  if (authChecking) return null
  if (!authenticated)
    return (
      <Login
        onLogin={(selectedRole) => {
          setRole(selectedRole)
          setAuthenticated(true)
        }}
      />
    )
  return (
    <div className="app-shell">
      <Sidebar
        role={role}
        active={active}
        setActive={setActive}
        open={sidebarOpen}
        close={() => setSidebarOpen(false)}
      />
      {sidebarOpen && (
        <button
          className="scrim"
          onClick={() => setSidebarOpen(false)}
          aria-label="Close navigation"
        />
      )}
      <div className="app-main">
        <Topbar
          role={role}
          onMenu={() => setSidebarOpen(true)}
          onSignOut={() => {
            void fetch("/api/auth/logout", {
              method: "POST",
              credentials: "include",
            }).finally(() => setAuthenticated(false))
          }}
          onNavigate={setActive}
        />
        <main>{content}</main>
        <button
          className="ds-shortcut"
          onClick={() => setActive("Design system")}
          title="Open design system"
        >
          <Icon name="settings" />
        </button>
      </div>
    </div>
  )
}

export default App
