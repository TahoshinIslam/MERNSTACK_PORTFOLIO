import { Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';

export default function Error() {
  return (
    <MasterLayout>
      <div style={{
        minHeight: '70vh',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '40px 28px',
        animation: 'pageEnter 0.5s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{ textAlign: 'center', maxWidth: 480 }}>
          {/* Giant 404 */}
          <div style={{
            fontFamily: 'var(--serif)',
            fontSize: 'clamp(100px,18vw,180px)',
            fontWeight: 700,
            lineHeight: 1,
            background: 'linear-gradient(135deg, var(--gold), var(--gold-light))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            marginBottom: 8,
            filter: 'drop-shadow(0 0 40px rgba(201,168,76,0.2))',
          }}>
            404
          </div>

          <div style={{ width: 48, height: 2, background: 'var(--gold)', margin: '0 auto 28px', borderRadius: 2 }} />

          <h1 style={{ fontFamily: 'var(--serif)', fontSize: 28, fontWeight: 700, color: 'var(--text)', marginBottom: 14 }}>
            Page Not Found
          </h1>
          <p style={{ fontSize: 15, color: 'var(--muted2)', lineHeight: 1.7, marginBottom: 40 }}>
            Looks like you've ventured into the unknown. The page you're looking for doesn't exist or has been moved.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 10 }}>
              Go Home
            </Link>
            <Link to="/contact" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 10 }}>
              Contact Me
            </Link>
          </div>
        </div>
      </div>
    </MasterLayout>
  );
}
