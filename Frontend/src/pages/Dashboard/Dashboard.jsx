import { useState, useEffect } from 'react';
import {
  portfolioAPI, blogAPI, serviceAPI, experienceAPI,
  educationAPI, advantageAPI, testimonialAPI, contactAPI, commentAPI
} from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const SECTIONS = [
  { label: 'Portfolio',    api: portfolioAPI,   icon: '◈', path: '/portfolio'   },
  { label: 'Blog Posts',   api: blogAPI,        icon: '✦', path: '/blog',  blogArgs: true },
  { label: 'Services',     api: serviceAPI,     icon: '◇', path: '/services'    },
  { label: 'Experience',   api: experienceAPI,  icon: '◉', path: '/experience'  },
  { label: 'Education',    api: educationAPI,   icon: '◎', path: '/education'   },
  { label: 'Advantages',   api: advantageAPI,   icon: '▲', path: '/advantages'  },
  { label: 'Testimonials', api: testimonialAPI, icon: '❝', path: '/testimonials'},
  { label: 'Contacts',     api: contactAPI,     icon: '✉', path: '/contacts'    },
  { label: 'Comments',     api: commentAPI,     icon: '◱', path: '/comments'    },
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [counts, setCounts] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const results = await Promise.allSettled(
        SECTIONS.map(s => s.blogArgs ? s.api.getAll(1, 100) : s.api.getAll())
      );
      const c = {};
      results.forEach((r, i) => {
        const label = SECTIONS[i].label;
        if (r.status === 'fulfilled') {
          const data = r.value.data?.data ?? r.value.data;
          c[label] = Array.isArray(data) ? data.length : (data?.total ?? '?');
        } else {
          c[label] = 0;
        }
      });
      setCounts(c);
      setLoading(false);
    };
    fetch();
  }, []);

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 26, color: 'var(--text)', marginBottom: 6 }}>
          Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
        </h2>
        <p style={{ color: 'var(--muted)', fontSize: 13 }}>
          Here's an overview of your portfolio content.
        </p>
      </div>

      {loading ? (
        <div className="spinner"><div className="spin" /></div>
      ) : (
        <div className="stats-grid">
          {SECTIONS.map(s => (
            <div
              key={s.label}
              className="stat-card"
              onClick={() => navigate(s.path)}
              style={{ cursor: 'pointer' }}
            >
              <div style={{ fontSize: 20, marginBottom: 10 }}>{s.icon}</div>
              <div className="stat-num">{counts[s.label] ?? '—'}</div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Quick links */}
      <div style={{ marginTop: 8 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
          Quick Actions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SECTIONS.slice(0, 4).map(s => (
            <button key={s.label} className="btn btn-outline" onClick={() => navigate(s.path)}>
              {s.icon} {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
