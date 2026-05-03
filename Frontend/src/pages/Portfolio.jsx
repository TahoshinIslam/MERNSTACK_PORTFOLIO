import { useState, useEffect, useMemo } from 'react';
import MasterLayout from './layout/MasterLayout';
import { portfolioAPI, resolveImg } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const PALETTE = [
  '#c9a84c', '#5294a8', '#a852a8', '#52a87e', '#e05252',
  '#a87c52', '#52a8a8', '#8452a8', '#cf6f5b', '#7a9c5b',
];

// Stable colour for each user-defined category
const colorFor = (cat) => {
  if (!cat) return '#a09d98';
  let h = 0;
  for (let i = 0; i < cat.length; i++) h = (h * 31 + cat.charCodeAt(i)) >>> 0;
  return PALETTE[h % PALETTE.length];
};

export default function Portfolio() {
  const [items,  setItems]  = useState([]);
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    portfolioAPI.getAll()
      .then(r => {
        const d = r.data?.data ?? r.data;
        setItems(Array.isArray(d) ? d : []);
      })
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  }, []);

  // Build filter list from actual data → so user-added categories show up
  const categories = useMemo(() => {
    const set = new Set();
    items.forEach(i => i.category && set.add(i.category));
    return ['All', ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [items]);

  const filtered = filter === 'All' ? items : items.filter(i => i.category === filter);

  function ProjectCard({ item, color, delay }) {
    const covers = [item.img, ...(Array.isArray(item.images) ? item.images : [])].filter(Boolean);
    const [coverIdx, setCoverIdx] = useState(0);
    const galleryCount = covers.length;
    const activeCover = covers[coverIdx] || item.img;

    return (
      <FadeIn delay={delay}>
        <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, overflow: 'hidden', transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s', height: '100%', display: 'flex', flexDirection: 'column' }}
          onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.25)`; }}
          onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
        >
          <div style={{ height: 200, background: `linear-gradient(135deg, ${color}18, ${color}08)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
            {activeCover ? (
              <img key={activeCover} src={resolveImg(activeCover)} alt={item.title} style={{ width: '100%', height: '100%', objectFit: 'cover', animation: 'pageEnter 0.25s ease' }} onError={e => e.target.style.display='none'} />
            ) : (
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>◈</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase', color }}>Project Preview</div>
              </div>
            )}
            <div style={{ position: 'absolute', top: 14, left: 14, background: `${color}22`, border: `1px solid ${color}44`, borderRadius: 100, padding: '4px 12px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color, backdropFilter: 'blur(4px)' }}>
              {item.category || 'Project'}
            </div>
            {galleryCount > 1 && (
              <div style={{ position: 'absolute', top: 14, right: 14, background: 'rgba(0,0,0,0.55)', borderRadius: 100, padding: '3px 10px', fontFamily: 'var(--mono)', fontSize: 10, color: '#fff' }}>
                ◇ {coverIdx + 1}/{galleryCount}
              </div>
            )}
          </div>

          <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 12, flex: 1 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--text)' }}>{item.title}</div>

            {galleryCount > 1 && (
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {covers.slice(0, 5).map((g, idx) => {
                  const active = idx === coverIdx;
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setCoverIdx(idx)}
                      aria-label={`Show image ${idx + 1}`}
                      style={{ width: 36, height: 36, borderRadius: 6, overflow: 'hidden', border: `1px solid ${active ? color : 'var(--border)'}`, padding: 0, background: 'transparent', cursor: 'pointer', outline: active ? `2px solid ${color}` : 'none', outlineOffset: 1 }}
                    >
                      <img src={resolveImg(g)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: active ? 1 : 0.75 }} />
                    </button>
                  );
                })}
              </div>
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 'auto', justifyContent: 'flex-end' }}>
              {item.link && item.link !== '#' && (
                <a href={item.link} target="_blank" rel="noreferrer" className="btn btn-primary btn-sm" style={{ borderRadius: 8 }}>
                  ↗ Live Link
                </a>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    );
  }

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

        {/* Filters — derived from actual portfolio data */}
        {!loading && categories.length > 1 && (
          <FadeIn delay={0.1}>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 40 }}>
              {categories.map(f => (
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
        )}

        {/* Grid */}
        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {[...Array(6)].map((_, i) => (
              <div key={i} className="shimmer" style={{ height: 280, borderRadius: 16, border: '1px solid var(--border)' }} />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty">
            <div className="empty-icon">◈</div>
            <p>No projects in this category yet.</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 24 }}>
            {filtered.map((item, i) => (
              <ProjectCard key={item._id} item={item} color={colorFor(item.category)} delay={i * 0.06} />
            ))}
          </div>
        )}
      </div>
    </MasterLayout>
  );
}
