import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import { blogAPI, resolveImg } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const SearchIcon = (props) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <circle cx="11" cy="11" r="7" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const EyeIcon = (props) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7S1 12 1 12z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const CommentIcon = (props) => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
);

const CAT_COLORS = { React: '#5294a8', Backend: '#52a87e', CSS: '#c9a84c', Database: '#a852a8', default: '#a09d98' };
const PER_PAGE = 6;

export default function Blog() {
  const [posts,   setPosts]   = useState([]);
  const [total,   setTotal]   = useState(0);
  const [loading, setLoading] = useState(true);
  const [search,  setSearch]  = useState('');
  const [page,    setPage]    = useState(1);

  useEffect(() => {
    setLoading(true);
    blogAPI.getAll(page, PER_PAGE)
      .then(r => {
        const d = r.data?.data ?? r.data;
        const facet = Array.isArray(d) ? d[0] : d;
        const blogs = facet?.blogs ?? (Array.isArray(d) ? d : []);
        const cnt = facet?.totalCount?.[0]?.count ?? blogs.length;
        setPosts(blogs);
        setTotal(cnt);
      })
      .catch(() => { setPosts([]); setTotal(0); })
      .finally(() => setLoading(false));
  }, [page]);

  const filtered = posts.filter(p =>
    !search || p.title?.toLowerCase().includes(search.toLowerCase())
  );

  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE));

  const formatDate = (d) => {
    if (!d) return '—';
    const dt = new Date(d);
    if (isNaN(dt)) return '—';
    return dt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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

        <FadeIn delay={0.1}>
          <div style={{ marginBottom: 40, maxWidth: 400 }}>
            <div style={{ position: 'relative' }}>
              <span style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)', display: 'inline-flex', alignItems: 'center' }}>
                <SearchIcon />
              </span>
              <input
                type="text"
                placeholder="Search posts on this page…"
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
                  <Link
                    to={`/blog/${post._id}`}
                    style={{ textDecoration: 'none', color: 'inherit' }}
                  >
                    <div
                      className="blog-row"
                      style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: '20px 24px', display: 'flex', gap: 20, alignItems: 'stretch', transition: 'border-color 0.2s, transform 0.2s', cursor: 'pointer' }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateX(4px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; }}
                    >
                      {post.img && (
                        <div style={{ width: 130, height: 100, borderRadius: 10, overflow: 'hidden', flexShrink: 0, border: '1px solid var(--border)' }} className="blog-row-img">
                          <img src={resolveImg(post.img)} alt={post.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                        </div>
                      )}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8, flexWrap: 'wrap' }}>
                          {post.category && (
                            <span style={{ background: `${color}18`, border: `1px solid ${color}30`, borderRadius: 100, padding: '2px 10px', fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.08em', color }}>
                              {post.category}
                            </span>
                          )}
                          <span style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                            {formatDate(post.date || post.createdAt)}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }} title="Views">
                            <EyeIcon />
                            {post.views ?? 0}
                          </span>
                          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }} title="Comments">
                            <CommentIcon />
                            {post.commentsCount ?? (Array.isArray(post.comments) ? post.comments.length : 0)}
                          </span>
                        </div>
                        <h3 style={{ fontFamily: 'var(--serif)', fontSize: 19, fontWeight: 600, color: 'var(--text)', marginBottom: 6, lineHeight: 1.3 }}>{post.title}</h3>
                        <p style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.65 }}>
                          {post.shortDescription || 'Read more…'}
                        </p>
                      </div>
                    </div>
                  </Link>
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

        {/* Pagination */}
        {!loading && total > PER_PAGE && (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 8, marginTop: 48, flexWrap: 'wrap' }}>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1}
              style={{ borderRadius: 8 }}
            >
              ← Prev
            </button>
            {Array.from({ length: totalPages }).slice(0, 7).map((_, idx) => {
              const n = idx + 1;
              const active = n === page;
              return (
                <button
                  key={n}
                  onClick={() => setPage(n)}
                  className="btn btn-sm"
                  style={{
                    borderRadius: 8,
                    minWidth: 36,
                    background: active ? 'var(--gold)' : 'var(--bg2)',
                    color: active ? '#0d0e11' : 'var(--muted2)',
                    border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`,
                    fontFamily: 'var(--mono)',
                  }}
                >
                  {n}
                </button>
              );
            })}
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page >= totalPages}
              style={{ borderRadius: 8 }}
            >
              Next →
            </button>
          </div>
        )}
      </div>

      <style>{`
        @media (max-width: 600px) {
          .blog-row { flex-direction: column; }
          .blog-row-img { width: 100% !important; height: 180px !important; }
        }
      `}</style>
    </MasterLayout>
  );
}
