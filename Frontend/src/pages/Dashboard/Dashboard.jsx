import { useState, useEffect, useRef } from 'react';
import {
  portfolioAPI, blogAPI, serviceAPI, experienceAPI,
  educationAPI, advantageAPI, testimonialAPI, contactAPI, commentAPI
} from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// Dashboard.jsx — SECTIONS array
const SECTIONS = [
  { label: 'Portfolio',    api: portfolioAPI,   icon: '◈', path: '/admin/portfolio',    color: '#c9a84c' },
  { label: 'Blog Posts',   api: blogAPI,        icon: '✦', path: '/admin/blog',         color: '#5294a8', blogArgs: true },
  { label: 'Services',     api: serviceAPI,     icon: '◇', path: '/admin/services',     color: '#52a87e' },
  { label: 'Experience',   api: experienceAPI,  icon: '◉', path: '/admin/experience',   color: '#a87c52' },
  { label: 'Education',    api: educationAPI,   icon: '◎', path: '/admin/education',    color: '#8452a8' },
  { label: 'Advantages',   api: advantageAPI,   icon: '▲', path: '/admin/advantages',   color: '#c9a84c' },
  { label: 'Testimonials', api: testimonialAPI, icon: '❝', path: '/admin/testimonials', color: '#52a8a8' },
  { label: 'Contacts',     api: contactAPI,     icon: '✉', path: '/admin/contacts',     color: '#e05252' },
  { label: 'Comments',     api: commentAPI,     icon: '◱', path: '/admin/comments',     color: '#52a87e' },
];
function AnimatedNumber({ target, duration = 800 }) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  const rafRef   = useRef(null);

  useEffect(() => {
    if (typeof target !== 'number') { setValue(target); return; }
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setValue(Math.round(eased * target));
      if (progress < 1) rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target, duration]);

  return <>{value}</>;
}

function StatCard({ section, count, index, navigate }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="stat-card"
      onClick={() => navigate(section.path)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        animation: `pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) both`,
        animationDelay: `${index * 55}ms`,
      }}
    >
      <div style={{
        position: 'absolute',
        top: -20, right: -20,
        width: 80, height: 80,
        borderRadius: '50%',
        background: `${section.color}18`,
        transition: 'transform 0.3s, opacity 0.3s',
        transform: hovered ? 'scale(1.3)' : 'scale(1)',
        opacity: hovered ? 1 : 0.8,
      }} />
      <div style={{
        fontSize: 20,
        marginBottom: 12,
        color: section.color,
        filter: hovered ? `drop-shadow(0 0 8px ${section.color}60)` : 'none',
        transition: 'filter 0.25s',
      }}>
        {section.icon}
      </div>
      <div className="stat-num" style={{ color: section.color }}>
        {typeof count === 'number'
          ? <AnimatedNumber target={count} duration={700 + index * 60} />
          : count ?? '—'}
      </div>
      <div className="stat-label">{section.label}</div>
    </div>
  );
}

export default function Dashboard() {
  const { user }    = useAuth();
  const navigate    = useNavigate();
  const [counts,   setCounts]  = useState({});
  const [loading,  setLoading] = useState(true);
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const h = new Date().getHours();
    if (h < 12)      setGreeting('Good morning');
    else if (h < 17) setGreeting('Good afternoon');
    else             setGreeting('Good evening');
  }, []);

  useEffect(() => {
    const fetchAll = async () => {
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
    fetchAll();
  }, []);

  const totalItems = Object.values(counts).reduce((a, b) => typeof b === 'number' ? a + b : a, 0);
  const name = user?.name || (user?.email ? user.email.split('@')[0] : 'Admin');

  return (
    <div>
      {/* Hero greeting */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg2) 0%, var(--bg3) 100%)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius-lg)',
        padding: '28px 32px',
        marginBottom: 28,
        position: 'relative',
        overflow: 'hidden',
        animation: 'pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      }}>
        {/* Decorative orb */}
        <div style={{
          position: 'absolute', top: -40, right: -40,
          width: 200, height: 200, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(201,168,76,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />
        <div style={{ position: 'relative' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>
            {greeting}
          </div>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--text)', marginBottom: 6, fontWeight: 700 }}>
            Welcome back, <span style={{ color: 'var(--gold)' }}>{name}</span>
          </h2>
          <p style={{ color: 'var(--muted)', fontSize: 13 }}>
            Your portfolio CMS is up and running.
            {!loading && ` You have `}
            {!loading && <span style={{ color: 'var(--gold)', fontWeight: 600 }}>{totalItems} items</span>}
            {!loading && ` across all sections.`}
          </p>
        </div>

        {/* Stats summary strip */}
        {!loading && (
          <div style={{
            display: 'flex', gap: 24, marginTop: 20,
            paddingTop: 20, borderTop: '1px solid var(--border)',
          }}>
            {[
              { label: 'Content Sections', value: SECTIONS.length },
              { label: 'Total Items', value: totalItems },
              { label: 'Status', value: '● Live' },
            ].map(s => (
              <div key={s.label}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--gold)' }}>
                  {s.value}
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)' }}>
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stat grid */}
      {loading ? (
        <div className="stats-grid">
          {SECTIONS.map((_, i) => (
            <div key={i} className="stat-card shimmer" style={{ height: 110 }} />
          ))}
        </div>
      ) : (
        <div className="stats-grid">
          {SECTIONS.map((s, i) => (
            <StatCard
              key={s.label}
              section={s}
              count={counts[s.label]}
              index={i}
              navigate={navigate}
            />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div style={{
        animation: 'pageEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1) 0.3s both',
      }}>
        <div style={{
          fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em',
          textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14,
        }}>
          Quick Actions
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          {SECTIONS.slice(0, 4).map((s, i) => (
            <button
              key={s.label}
              className="btn btn-outline"
              onClick={() => navigate(s.path)}
              style={{
                animation: `pageEnter 0.4s cubic-bezier(0.4, 0, 0.2, 1) ${0.35 + i * 0.05}s both`,
              }}
            >
              <span style={{ color: s.color }}>{s.icon}</span>
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
