import { useState, useEffect } from 'react';
import MasterLayout from './layout/MasterLayout';
import { portfolioAPI } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const FILTERS = ['All', 'Web Design', 'Mobile', 'Branding', 'UI/UX'];

const FALLBACK = [
  { _id: '1', title: 'E-Commerce Platform',   category: 'Web Design', img: null, link: '#' },
  { _id: '2', title: 'Mobile Banking App',    category: 'Mobile',     img: null, link: '#' },
  { _id: '3', title: 'Brand Identity System', category: 'Branding',   img: null, link: '#' },
  { _id: '4', title: 'Dashboard Analytics',   category: 'UI/UX',      img: null, link: '#' },
  { _id: '5', title: 'Portfolio Website',     category: 'Web Design',  img: null, link: '#' },
  { _id: '6', title: 'Food Delivery App',     category: 'Mobile',     img: null, link: '#' },
];

const COLORS = { 'Web Design': '#c9a84c', Mobile: '#5294a8', Branding: '#a852a8', 'UI/UX': '#52a87e', default: '#a09d98' };

export default function Portfolio() {
  const [items,  setItems]  = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioAPI.getAll()
      .then(r => {
        const d = r.data?.data ?? r.data;
        setItems(Array.isArray(d) && d.length ? d : FALLBACK);
      })
      .catch(() => setItems(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  return (
    <MasterLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 100px' }}>

        <FadeIn delay={0}>
          <div style={{ marginBottom: 56 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Portfolio</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>My Work</h1>
            <p style={{ fontSize: 15, color: 'var(--muted2)', maxWidth: 520, lineHeight: 1.7 }}>
              A collection of projects I've built — from web apps to mobile experiences. Each one crafted with purpose.
            </p>
          </div>
        </FadeIn>

        {/* Filters */}
        <FadeIn delay={0.1}>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
            {FILTERS.map(f => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="btn"
                style={{
                  padding: '7px 18px',
                  borderRadius: 100,
                  fontSize: 12,
                  fontFamily: 'var(--mono)',
                  letterSpacing: '0.06em',
                  background: filter === f ? 'var(--gold)' : 'var(--bg2)',
                  color: filter === f ? '#0d0e11' : 'var(--muted2)',
                  border: `1px solid ${filter === f ? 'var(--gold)' : 'var(--border)'}`,
                }}
              >
                {f}
              </button>
            ))}
          </div>
        </FadeIn>

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer" style={{ height: 280, borderRadius: 16, border: '1px solid var(--border)' }} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {filtered.map((item, i) => {
              const color = COLORS[item.category] || COLORS.default;
              return (
                <FadeIn key={item._id} delay={i * 0.06}>
                  <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.25)`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    {/* Image area */}
                    <div style={{ height: 200, background: `linear-gradient(135deg, ${color}18, ${color}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
                      {item.img ? (
                        <img src={item.img} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 36, marginBottom: 8 }}>◈</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>Project Preview</div>
                        </div>
                      )}
                      {/* Category tag */}
                      <div style={{ position: 'absolute', top: 14, left: 14, background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 100, padding: '4px 12px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color }}>
                        {item.category || 'Project'}
                      </div>
                    </div>

                    <div style={{ padding: '18px 20px' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>{item.title}</div>
                      <div style={{ display: 'flex', gap: 10 }}>
                        {item.link && item.link !== '#' && (
                          <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-outline btn-sm" style={{ borderRadius: 8 }}>
                            ↗ Visit
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">◈</div>
            <p>No projects in this category yet.</p>
          </div>
        )}
      </div>
    </MasterLayout>
  );
}
