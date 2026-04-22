import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import { blogAPI } from '../api';

export default function BlogDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    blogAPI.getOne(id)
      .then(r => {
        const d = r.data?.data ?? r.data;
        // aggregate() always returns an array — grab the first element
        setPost(Array.isArray(d) ? (d[0] ?? null) : d);
      })
      .catch(() => setPost(null))
      .finally(() => setLoading(false));
  }, [id]);

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
    try { return new Date(d).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }); }
    catch { return d; }
  };

  return (
    <MasterLayout>
      <div style={{ maxWidth: 760, margin: '0 auto', padding: '60px 28px 100px', animation: 'pageEnter 0.5s cubic-bezier(0.4,0,0.2,1)' }}>
        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 40, fontSize: 13 }}>
          <Link to="/blog" style={{ color: 'var(--muted)', textDecoration: 'none' }}>Blog</Link>
          <span style={{ color: 'var(--muted)' }}>→</span>
          <span style={{ color: 'var(--gold)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</span>
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

        {/* Cover image */}
        {post.img && (
          <div style={{ marginBottom: 40, borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border)' }}>
            <img src={post.img} alt={post.title} style={{ width: '100%', maxHeight: 420, objectFit: 'cover', display: 'block' }} />
          </div>
        )}

        {/* Content */}
        <div style={{ fontSize: 15, color: 'var(--muted2)', lineHeight: 1.85 }}>
          {(post.description || post.content || 'No content available.')
            .split('\n').filter(Boolean).map((para, i) => (
              <p key={i} style={{ marginBottom: 20 }}>{para}</p>
            ))}
        </div>

        {/* Back */}
        <div style={{ marginTop: 64, paddingTop: 32, borderTop: '1px solid var(--border)' }}>
          <Link to="/blog" className="btn btn-outline" style={{ borderRadius: 10 }}>
            ← Back to Blog
          </Link>
        </div>
      </div>
    </MasterLayout>
  );
}
