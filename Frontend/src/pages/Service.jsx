import { useState, useEffect } from 'react';
import MasterLayout from './layout/MasterLayout';
import { serviceAPI } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const FALLBACK = [
  { _id: '1', title: 'Web Development',   description: 'Custom, responsive web applications built with modern frameworks. From landing pages to complex SaaS platforms.', icon: '⚡' },
  { _id: '2', title: 'UI / UX Design',    description: 'Beautiful, intuitive interfaces that delight users. Wireframes, prototypes, and production-ready design systems.', icon: '🎨' },
  { _id: '3', title: 'Mobile Apps',       description: 'Cross-platform mobile applications with React Native. Native performance, one codebase.', icon: '📱' },
  { _id: '4', title: 'API Development',   description: 'Robust RESTful and GraphQL APIs. Clean architecture, proper documentation, and rock-solid security.', icon: '🔗' },
  { _id: '5', title: 'Cloud & DevOps',    description: 'Infrastructure setup, CI/CD pipelines, and cloud deployment on AWS, GCP, and Digital Ocean.', icon: '☁️' },
  { _id: '6', title: 'Code Review',       description: 'Expert code reviews and technical consulting to improve your team\'s codebase quality and practices.', icon: '🔍' },
];

const COLORS = ['#c9a84c', '#5294a8', '#52a87e', '#a852a8', '#e05252', '#a87c52'];

export default function Service() {
  const [services, setServices] = useState([]);
  const [loading, setLoading]  = useState(true);

  useEffect(() => {
    serviceAPI.getAll()
      .then(r => {
        const d = r.data?.data ?? r.data;
        setServices(Array.isArray(d) && d.length ? d : FALLBACK);
      })
      .catch(() => setServices(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  return (
    <MasterLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 100px' }}>

        <FadeIn delay={0}>
          <div style={{ textAlign: 'center', marginBottom: 72 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>What I Offer</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Services</h1>
            <p style={{ fontSize: 15, color: 'var(--muted2)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
              End-to-end solutions for your digital needs. I bring expertise across the full product lifecycle.
            </p>
          </div>
        </FadeIn>

        {loading ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
            {[...Array(6)].map((_, i) => <div key={i} className="shimmer" style={{ height: 220, borderRadius: 16, border: '1px solid var(--border)' }} />)}
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
            {services.map((svc, i) => {
              const color = COLORS[i % COLORS.length];
              const icon  = svc.icon || ['⚡','🎨','📱','🔗','☁️','🔍'][i % 6];
              return (
                <FadeIn key={svc._id} delay={i * 0.07}>
                  <div
                    style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 32, height: '100%', transition: 'border-color 0.25s, transform 0.25s, box-shadow 0.25s', cursor: 'default', position: 'relative', overflow: 'hidden' }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = `0 20px 48px rgba(0,0,0,0.25), 0 0 0 1px ${color}22`; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                  >
                    <div style={{ position: 'absolute', top: -20, right: -20, width: 100, height: 100, borderRadius: '50%', background: `${color}10` }} />

                    <div style={{ width: 52, height: 52, borderRadius: 14, background: `${color}18`, border: `1px solid ${color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, marginBottom: 20 }}>
                      {icon}
                    </div>

                    <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 12 }}>{svc.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.7 }}>{svc.description}</div>

                    <div style={{ marginTop: 24, display: 'flex', alignItems: 'center', gap: 6, fontFamily: 'var(--mono)', fontSize: 11, color, letterSpacing: '0.08em' }}>
                      <span>Learn more</span>
                      <span style={{ fontSize: 16 }}>→</span>
                    </div>
                  </div>
                </FadeIn>
              );
            })}
          </div>
        )}

        {/* CTA banner */}
        <FadeIn delay={0.3}>
          <div style={{ marginTop: 80, background: 'linear-gradient(135deg,var(--bg2),var(--bg3))', border: '1px solid var(--border)', borderRadius: 20, padding: '48px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}>
            <div>
              <h3 style={{ fontFamily: 'var(--serif)', fontSize: 26, fontWeight: 700, color: 'var(--text)', marginBottom: 8 }}>Ready to start a project?</h3>
              <p style={{ fontSize: 14, color: 'var(--muted2)' }}>Let's discuss how I can help bring your ideas to life.</p>
            </div>
            <a href="/contact" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 10, flexShrink: 0 }}>
              Start a Conversation →
            </a>
          </div>
        </FadeIn>
      </div>
    </MasterLayout>
  );
}
