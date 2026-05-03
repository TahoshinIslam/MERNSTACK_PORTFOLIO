import { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

const NAV_LINKS = [
  { to: '/',          label: 'Home'      },
  { to: '/about',     label: 'About'     },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/service',   label: 'Services'  },
  { to: '/blog',      label: 'Blog'      },
  { to: '/contact',   label: 'Contact'   },
];

export default function MasterLayout({ children }) {
  const [menuOpen,   setMenuOpen]   = useState(false);
  const [scrolled,   setScrolled]   = useState(false);
  const { mode, toggleMode }         = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => { setMenuOpen(false); }, []);

  const isDark = mode === 'dark';

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg)', color: 'var(--text)' }}>
      {/* ── Header ──────────────────────────────────────────────── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: scrolled ? '12px 0' : '20px 0',
        background: scrolled
          ? (isDark ? 'rgba(13,14,17,0.92)' : 'rgba(245,244,240,0.92)')
          : 'transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border)' : '1px solid transparent',
        transition: 'padding 0.3s, background 0.3s, border-color 0.3s',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Logo */}
          <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--gold-dim)',
              border: '1px solid var(--gold)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <span style={{ fontFamily: 'var(--serif)', fontSize: 14, color: 'var(--gold)', fontWeight: 800 }}>DEV</span>
            </div>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 700, color: 'var(--gold)' }}>
              Tahoshin
            </span>
          </Link>

          {/* Desktop nav */}
          <nav style={{ display: 'none', gap: 4, alignItems: 'center' }} className="desktop-nav">
            {NAV_LINKS.map(link => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                style={({ isActive }) => ({
                  padding: '7px 14px',
                  borderRadius: 8,
                  fontSize: 13,
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? 'var(--gold)' : 'var(--muted2)',
                  background: isActive ? 'var(--gold-dim)' : 'transparent',
                  transition: 'color 0.2s, background 0.2s',
                })}
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* Right controls */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            {/* Theme toggle */}
            <button
              onClick={toggleMode}
              title={`Switch to ${isDark ? 'light' : 'dark'} mode`}
              style={{
                width: 36, height: 36,
                borderRadius: 10,
                border: '1px solid var(--border2)',
                background: 'var(--bg2)',
                cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 16,
                color: 'var(--muted2)',
              }}
            >
              {isDark ? '☀️' : '🌙'}
            </button>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen(v => !v)}
              style={{
                display: 'flex', flexDirection: 'column', gap: 4, padding: 8,
                border: '1px solid var(--border2)', borderRadius: 8,
                background: 'var(--bg2)', cursor: 'pointer',
              }}
              aria-label="Toggle menu"
            >
              {[0, 1, 2].map(i => (
                <span key={i} style={{
                  width: 18, height: 1.5, borderRadius: 2,
                  background: 'var(--text)',
                  display: 'block',
                  transition: 'transform 0.3s, opacity 0.3s',
                  transform: menuOpen
                    ? i === 0 ? 'rotate(45deg) translate(3.5px, 3.5px)'
                    : i === 2 ? 'rotate(-45deg) translate(3.5px, -3.5px)'
                    : 'none' : 'none',
                  opacity: menuOpen && i === 1 ? 0 : 1,
                }} />
              ))}
            </button>
          </div>
        </div>
      </header>

      {/* ── Mobile drawer ────────────────────────────────────────── */}
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0,
        width: 280,
        background: 'var(--bg2)',
        borderLeft: '1px solid var(--border)',
        zIndex: 200,
        transform: menuOpen ? 'translateX(0)' : 'translateX(100%)',
        transition: 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
        padding: '72px 28px 28px',
        display: 'flex', flexDirection: 'column',
      }}>
        <nav style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {NAV_LINKS.map(link => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              style={({ isActive }) => ({
                padding: '11px 16px',
                borderRadius: 8,
                fontSize: 15,
                fontWeight: 500,
                textDecoration: 'none',
                color: isActive ? 'var(--gold)' : 'var(--muted2)',
                background: isActive ? 'var(--gold-dim)' : 'transparent',
              })}
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 20, borderTop: '1px solid var(--border)' }}>
          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            style={{
              display: 'block', padding: '10px 16px',
              background: 'var(--gold)', color: '#0d0e11',
              borderRadius: 8, textDecoration: 'none',
              fontSize: 13, fontWeight: 600, textAlign: 'center',
            }}
          >
            Admin Login
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div
          onClick={() => setMenuOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 150,
            background: 'rgba(0,0,0,0.5)',
            backdropFilter: 'blur(4px)',
            animation: 'fadeIn 0.2s ease',
          }}
        />
      )}

      {/* Desktop nav style injection */}
      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
        }
      `}</style>

      {/* ── Main content ─────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* ── Footer ──────────────────────────────────────────────── */}
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '40px 28px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--gold)', marginBottom: 8 }}>Portfolio</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 20, marginBottom: 20 }}>
            {NAV_LINKS.map(link => (
              <Link key={link.to} to={link.to} style={{ fontSize: 12, color: 'var(--muted)', textDecoration: 'none' }}>
                {link.label}
              </Link>
            ))}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            Copyright <span style={{ color: 'var(--gold)' }}>Tahoshin</span> © {new Date().getFullYear()}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
