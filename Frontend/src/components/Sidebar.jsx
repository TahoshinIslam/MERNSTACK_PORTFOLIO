import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NAV = [
  { label: 'Main', items: [
    { path: '/',           icon: '▦',  name: 'Dashboard'    },
  ]},
  { label: 'Content', items: [
    { path: '/portfolio',  icon: '◈',  name: 'Portfolio'    },
    { path: '/blog',       icon: '✦',  name: 'Blog'         },
    { path: '/services',   icon: '◇',  name: 'Services'     },
  ]},
  { label: 'About', items: [
    { path: '/experience', icon: '◉',  name: 'Experience'   },
    { path: '/education',  icon: '◎',  name: 'Education'    },
    { path: '/advantages', icon: '▲',  name: 'Advantages'   },
  ]},
  { label: 'Social', items: [
    { path: '/testimonials',icon: '❝', name: 'Testimonials' },
    { path: '/contacts',   icon: '✉',  name: 'Contacts'     },
    { path: '/comments',   icon: '◱',  name: 'Comments'     },
  ]},
  { label: 'Account', items: [
    { path: '/settings',   icon: '⚙',  name: 'Settings'     },
  ]},
];

export default function Sidebar({ currentPath }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <h1>Portfolio<br/>CMS</h1>
        <span>Admin Panel</span>
      </div>

      <div style={{ flex: 1 }}>
        {NAV.map(group => (
          <div key={group.label} className="nav-group">
            <div className="nav-label">{group.label}</div>
            {group.items.map(item => (
              <button
                key={item.path}
                className={`nav-item ${currentPath === item.path || (item.path !== '/' && currentPath.startsWith(item.path)) ? 'active' : ''}`}
                onClick={() => navigate(item.path)}
              >
                <span style={{ fontSize: 13, width: 16, textAlign: 'center' }}>{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>
        ))}
      </div>

      <div className="sidebar-footer">
        <div className="user-pill">
          <div className="user-avatar">
            {user?.email?.[0]?.toUpperCase() || 'A'}
          </div>
          <div className="user-email">{user?.email}</div>
          <button className="logout-btn" onClick={logout} title="Logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/>
            </svg>
          </button>
        </div>
      </div>
    </nav>
  );
}
