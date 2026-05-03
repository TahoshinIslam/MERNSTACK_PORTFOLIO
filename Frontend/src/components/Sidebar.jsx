import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import { useTheme } from '../context/ThemeContext';
import { resolveImg } from '../api';

const NAV = [
  { label: 'Main', items: [
    { path: '/admin',             icon: HomeIcon,        name: 'Dashboard'    },
  ]},
  { label: 'Content', items: [
    { path: '/admin/portfolio',    icon: GridIcon,        name: 'Portfolio'    },
    { path: '/admin/blog',         icon: BookIcon,        name: 'Blog'         },
    { path: '/admin/services',     icon: BriefcaseIcon,   name: 'Services'     },
  ]},
  { label: 'About', items: [
    { path: '/admin/experience',   icon: ClockIcon,       name: 'Experience'   },
    { path: '/admin/education',    icon: AcademicIcon,    name: 'Education'    },
    { path: '/admin/advantages',   icon: StarIcon,        name: 'Advantages'   },
  ]},
  { label: 'Social', items: [
    { path: '/admin/testimonials', icon: QuoteIcon,       name: 'Testimonials' },
    { path: '/admin/contacts',     icon: MailIcon,        name: 'Contacts'     },
    { path: '/admin/comments',     icon: ChatIcon,        name: 'Comments'     },
  ]},
  { label: 'Account', items: [
    { path: '/admin/settings',     icon: SettingsIcon,    name: 'Settings'     },
  ]},
];

function NavIcon({ Icon, active }) {
  return (
    <span className="nav-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Icon size={15} active={active} />
    </span>
  );
}

export default function Sidebar({ currentPath }) {
  const { user, logout }    = useAuth();
  const { mode, toggleMode } = useTheme();
  const navigate             = useNavigate();
  const [open, setOpen]     = useState(false);

  // Close drawer on route change
  useEffect(() => { setOpen(false); }, [currentPath]);

  const isActive = (path) =>
    path === '/'
      ? currentPath === '/admin'
      : currentPath === path || currentPath.startsWith(path + '/');

  const initials = (user?.name || user?.email || 'A')[0].toUpperCase();

  return (
    <>
    {/* Mobile hamburger (only shown < 768px via CSS) */}
    <button
      className="sidebar-mobile-toggle"
      onClick={() => setOpen(v => !v)}
      aria-label="Toggle navigation"
    >
      <span /><span /><span />
    </button>
    {open && <div className="sidebar-overlay" onClick={() => setOpen(false)} />}

    <nav className={`sidebar ${open ? 'is-open' : ''}`}>
      {/* Brand */}
      <div className="sidebar-brand">
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 2 }}>
          <div style={{
            width: 30, height: 30,
            background: 'var(--gold-dim)',
            border: '1px solid var(--gold)',
            borderRadius: 8,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--gold)', fontWeight: 700 }}>P</span>
          </div>
          <h1>Portfolio CMS</h1>
        </div>
        <span>Admin Panel · v2.0</span>
      </div>

      {/* Navigation */}
      <div style={{ flex: 1, paddingBottom: 8 }}>
        {NAV.map(group => (
          <div key={group.label} className="nav-group">
            <div className="nav-label">{group.label}</div>
            {group.items.map(item => {
              const active = isActive(item.path);
              return (
                <button
                  key={item.path}
                  className={`nav-item ${active ? 'active' : ''}`}
                  onClick={() => navigate(item.path)}
                >
                  <NavIcon Icon={item.icon} active={active} />
                  {item.name}
                  {active && (
                    <span style={{
                      marginLeft: 'auto',
                      width: 6, height: 6,
                      borderRadius: '50%',
                      background: 'var(--gold)',
                      flexShrink: 0,
                    }} />
                  )}
                </button>
              );
            })}
          </div>
        ))}
      </div>

      {/* Theme toggle */}
      <div style={{ padding: '10px 22px', borderTop: '1px solid var(--border)' }}>
        <button
          onClick={toggleMode}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            background: 'var(--bg3)',
            border: '1px solid var(--border)',
            borderRadius: 8,
            padding: '8px 12px',
            cursor: 'pointer',
            color: 'var(--muted2)',
            fontSize: 12,
            fontFamily: 'var(--mono)',
          }}
        >
          <span style={{ fontSize: 14 }}>{mode === 'dark' ? '☀️' : '🌙'}</span>
          <span>{mode === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          <div className={`toggle-track ${mode === 'light' ? 'on' : ''}`} style={{ marginLeft: 'auto' }}>
            <div className="toggle-thumb" />
          </div>
        </button>
      </div>

      {/* User footer */}
      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar" style={{ overflow: 'hidden' }}>
            {user?.picture
              ? <img src={resolveImg(user.picture)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
              : initials
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div className="user-email">{user?.name || user?.email}</div>
            <div style={{ fontSize: 9, fontFamily: 'var(--mono)', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginTop: 1 }}>Administrator</div>
          </div>
          <button
            className="logout-btn"
            onClick={logout}
            title="Logout"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
    </>
  );
}

/* ── Inline SVG icon components ───────────────────────────────── */
function HomeIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
      <polyline points="9 22 9 12 15 12 15 22"/>
    </svg>
  );
}
function GridIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
      <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
    </svg>
  );
}
function BookIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}
function BriefcaseIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  );
}
function ClockIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <polyline points="12 6 12 12 16 14"/>
    </svg>
  );
}
function AcademicIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z"/>
      <path d="M6 12v5c3 3 9 3 12 0v-5"/>
    </svg>
  );
}
function StarIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
    </svg>
  );
}
function QuoteIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
      <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
    </svg>
  );
}
function MailIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function ChatIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
    </svg>
  );
}
function SettingsIcon({ size = 15 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3"/>
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
  );
}
