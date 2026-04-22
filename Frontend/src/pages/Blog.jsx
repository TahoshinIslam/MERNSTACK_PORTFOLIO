import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import { blogAPI } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const FALLBACK = [
  { _id: '1', title: 'Building Scalable React Applications', category: 'React', date: '2024-12-01', description: 'A deep dive into architecture patterns for large-scale React apps that stay maintainable as your team grows.' },
  { _id: '2', title: 'The Art of API Design',                category: 'Backend', date: '2024-11-15', description: 'Principles for designing REST APIs that developers love to use — and that actually last over time.' },
  { _id: '3', title: 'CSS Grid vs Flexbox: When to Use Each', category: 'CSS', date: '2024-11-01', description: 'A practical guide to choosing the right layout tool for every situation, with real-world examples.' },
  { _id: '4', title: 'MongoDB Performance Tuning',             category: 'Database', date: '2024-10-20', description: 'Index strategies, aggregation pipelines, and query optimization tips that will transform your app\'s speed.' },
];

const CAT_COLORS = { React: '#5294a8', Backend: '#52a87e', CSS: '#c9a84c', Database: '#a852a8', default: '#a09d98' };

export default function Blog() {
  const [posts,   setPosts]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');

  useEffect(() => {
    blogAPI.getAll(1, 50)
      .then(r => {
        const d = r.data?.data ?? r.data;
        // $facet returns [{totalCount:[…], blogs:[…]}] — unpack the blogs array
        const blogs = Array.isArray(d) ? (d[0]?.blogs ?? []) : [];
        // Only fall back to dummy data on a real API error (catch below),
        // not when the database is legitimately empty
        setPosts(blogs);
      })
      .catch(() => setPosts(FALLBACK))   // ← FALLBACK only on network/server error
      .finally(() => setLoading(false));
  }, []);

  const filtered = posts.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (d) => {
    try { return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }); }
    catch { return d; }
  };

  return (
    <MasterLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 28px 100px' }}>

        <FadeIn delay={0}>
          <div style={{ marginBottom: 52 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Writing</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Blog</h1>
            <p style={{ fontSize: 15, color: 'var(--muted2)', maxWidth: 520, lineHeight: 1.7 }}>
              Thoughts on development, design, and building great software.
            </p>
          </div>
        </FadeIn>

        {/* Search */}
        <FadeIn delay={0.1}>
          <div style={{ marginBottom: 40, maxWidth: 400 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', fontSize: 14 }}>🔍</span>
              <input
                type="text"
                placeholder="Search posts…"
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px 10px 40px', fontSize: 14, color: 'var(--text)', fontFamily: 'var(--sans)', outline: 'none' }}
                onFocus={e => e.target.style.borderColor = 'var(--gold)'}
                onBlur={e => e.target.style.borderColor = 'var(--border)'}
              />
            </div>
          </div>
        </FadeIn>

        {loading ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {[...Array(4)].map((_, i) => <div key={i} className="shimmer" style={{ height: 140, borderRadius: 16, border: '1px solid var(--border)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {filtered.map((post, i) => {
              const color = CAT_COLORS[post.category] || CAT_COLORS.default;
              return (
                <FadeIn key={post._id} delay={i * 0.06}>
                  <div
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '24px 28px', display: 'flex', gap: 24, alignItems: 'flex-start', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateX(4px)'; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
                  >
                    {/* Date column */}
                    <div style={{ flexShrink: 0, width: 54, textAlign: 'center', paddingTop: 2 }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                        {post.date ? new Date(post.date).getDate() || '—' : '—'}
                      </div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 2 }}>
                        {post.date ? new Date(post.date).toLocaleString('en-US', { month: 'short' }) : ''}
                      </div>
                    </div>

                    <div style={{ borderLeft: `2px solid ${color}44`, paddingLeft: 20, flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                        {post.category && (
                          <span style={{ background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 100, padding: '2px 10px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color }}>
                            {post.category}
                          </span>
                        )}
                        <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                          {formatDate(post.date || post.createdAt)}
                        </span>
                      </div>
                      <h3 style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 600, color: 'var(--text)', marginBottom: 8, lineHeight: 1.3 }}>{post.title}</h3>
                      <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.65, marginBottom: 12 }}>
                        {post.shortDescription || post.description || 'Read more…'}
                      </p>
                      <Link to={`/blog/${post._id}`} style={{ fontFamily: 'var(--mono)', fontSize: 11, color, textDecoration: 'none', letterSpacing: '0.08em' }}>
                        Read article →
                      </Link>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="empty">
            <div className="empty-icon">✦</div>
            <p>{search ? 'No posts match your search.' : 'No blog posts yet.'}</p>
          </div>
        )}
      </div>
    </MasterLayout>
  );
}
