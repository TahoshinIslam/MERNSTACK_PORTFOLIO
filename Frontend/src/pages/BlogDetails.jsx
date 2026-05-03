import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import { blogAPI, commentAPI, resolveImg } from '../api';

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverIdx, setCoverIdx] = useState(0);

  // Comment form state
  const [cForm, setCForm] = useState({ name: '', email: '', comment: '' });
  const [posting, setPosting] = useState(false);
  const [err, setErr] = useState('');

  const fetchPost = () => {
    return blogAPI.getOne(id)
      .then(r => {
        const d = r.data?.data ?? r.data;
        setPost(Array.isArray(d) ? (d[0] ?? null) : d);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchPost(); }, [id]);

  const submitComment = async (e) => {
    e.preventDefault();
    setErr('');
    if (!cForm.name || !cForm.email || !cForm.comment) {
      setErr('Please fill in all fields.');
      return;
    }
    setPosting(true);
    try {
      await commentAPI.create({ ...cForm, blogID: id });
      setCForm({ name: '', email: '', comment: '' });
      // refresh post (with comments via $lookup)
      await fetchPost();
    } catch (ex) {
      setErr(ex.response?.data?.message || 'Failed to post comment.');
    } finally { setPosting(false); }
  };

  if (loading) return (
    <MasterLayout>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 28px' }}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className="shimmer" style={{ height: i === 0 ? 48 : 18, borderRadius: 8, marginBottom: 16, width: i === 0 ? '60%' : `${70 + Math.random() * 30}%` }} />
        ))}
      </div>
    </MasterLayout>
  );

  if (!post) return (
    <MasterLayout>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '80px 28px', textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 20 }}>✦</div>
        <h2 style={{ fontFamily: 'var(--serif)', fontSize: 28, color: 'var(--text)', marginBottom: 12 }}>Post Not Found</h2>
        <p style={{ color: 'var(--muted)', marginBottom: 32 }}>This blog post doesn't exist or has been removed.</p>
        <Link to="/blog" className="btn btn-outline">← Back to Blog</Link>
      </div>
    </MasterLayout>
  );

  const formatDate = (d) => {
    if (!d) return '';
    const dt = new Date(d);
    if (isNaN(dt)) return '';
    return dt.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const comments = Array.isArray(post.comments) ? post.comments : [];
  const allImages = [post.img, ...(Array.isArray(post.images) ? post.images : [])].filter(Boolean);
  const activeImg = allImages[coverIdx] || allImages[0];

  // Split body into paragraphs: blank-line separates paragraphs,
  // single newline within a paragraph becomes a soft <br>.
  const rawBody = post.description || post.content || 'No content available.';
  const paragraphs = rawBody.split(/\n\s*\n/).map(p => p.trim()).filter(Boolean);

  return (
    <MasterLayout>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 28px 100px', animation: 'pageEnter 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontSize: 13, flexWrap: 'wrap' }}>
          <Link to="/blog" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Blog</Link>
          <span style={{ color: 'var(--muted)' }}>→</span>
          <span style={{ color: 'var(--gold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', minWidth: 0, flex: 1 }}>{post.title}</span>
        </div>

        {/* Meta */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          {post.category && (
            <span style={{ background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 100, padding: '4px 14px', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.08em', color: 'var(--gold)' }}>
              {post.category}
            </span>
          )}
          <span style={{ fontSize: 12, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
            {formatDate(post.date || post.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(28px,4vw,44px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.2, marginBottom: 32 }}>
          {post.title}
        </h1>

        {/* Cover gallery — main image swaps when a thumbnail is clicked */}
        {activeImg && (
          <div style={{ marginBottom: 40 }}>
            <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)', marginBottom: allImages.length > 1 ? 12 : 0 }}>
              <img key={activeImg} src={resolveImg(activeImg)} alt={post.title} style={{ width: '100%', maxHeight: 480, objectFit: 'cover', display: 'block', animation: 'pageEnter 0.25s ease' }} />
            </div>
            {allImages.length > 1 && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                {allImages.map((g, i) => {
                  const active = i === coverIdx;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setCoverIdx(i)}
                      aria-label={`Show image ${i + 1}`}
                      style={{ width: 72, height: 56, borderRadius: 8, overflow: 'hidden', border: `1px solid ${active ? 'var(--gold)' : 'var(--border)'}`, padding: 0, background: 'transparent', cursor: 'pointer', outline: active ? '2px solid var(--gold)' : 'none', outlineOffset: 1 }}
                    >
                      <img src={resolveImg(g)} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: active ? 1 : 0.7 }} />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Content */}
        <div style={{ fontSize: 16, color: 'var(--muted2)', lineHeight: 1.9, overflowWrap: 'anywhere', wordBreak: 'break-word' }}>
          {paragraphs.map((para, i) => (
            <p key={i} style={{ marginBottom: 28 }}>
              {para.split('\n').map((line, j, arr) => (
                <span key={j}>{line}{j < arr.length - 1 && <br />}</span>
              ))}
            </p>
          ))}
        </div>

        {/* ── Comments ───────────────────────────────────────────── */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>
            Comments ({comments.length})
          </div>

          <h3 style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 24 }}>
            Join the conversation
          </h3>

          {/* Existing comments */}
          {comments.length === 0 ? (
            <div style={{ color: 'var(--muted)', fontSize: 14, marginBottom: 32 }}>
              Be the first to leave a comment.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 32 }}>
              {comments
                .slice()
                .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
                .map(c => (
                <div key={c._id} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', color: 'var(--gold)', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>
                      {(c.name?.[0] || '?').toUpperCase()}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}>{c.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>
                        {c.createdAt ? new Date(c.createdAt).toLocaleString() : ''}
                      </div>
                    </div>
                  </div>
                  <div style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>
                    {c.comment}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Comment form */}
          <form onSubmit={submitComment} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div style={{ fontFamily: 'var(--serif)', fontSize: 18, fontWeight: 600, color: 'var(--text)' }}>Leave a comment</div>
            {err && <div className="error-banner">{err}</div>}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }} className="comment-form-grid">
              <div className="form-group">
                <label>Name *</label>
                <input value={cForm.name} onChange={e => setCForm({ ...cForm, name: e.target.value })} placeholder="Your name" required />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input type="email" value={cForm.email} onChange={e => setCForm({ ...cForm, email: e.target.value })} placeholder="you@example.com" required />
              </div>
            </div>
            <div className="form-group">
              <label>Comment *</label>
              <textarea value={cForm.comment} onChange={e => setCForm({ ...cForm, comment: e.target.value })} placeholder="Share your thoughts…" rows={4} required />
            </div>
            <button className="btn btn-primary" type="submit" disabled={posting} style={{ alignSelf: 'flex-start' }}>
              {posting ? 'Posting…' : 'Post Comment'}
            </button>
          </form>
        </div>

        {/* Back */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <Link to="/blog" className="btn btn-outline" style={{ borderRadius: 10 }}>
            ← Back to Blog
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 600px) {
          .comment-form-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </MasterLayout>
  );
}
