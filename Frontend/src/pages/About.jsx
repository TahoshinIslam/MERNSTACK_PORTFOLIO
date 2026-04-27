import { useEffect, useState } from 'react';
import MasterLayout from './layout/MasterLayout';
import { Link } from 'react-router-dom';
import { educationAPI, experienceAPI, getProfile, resolveImg } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const VALUES = [
  { icon: '⚡', title: 'Performance First',  desc: 'Every millisecond counts. I optimize relentlessly.' },
  { icon: '🎨', title: 'Design Precision',   desc: 'Pixel-perfect execution with an eye for detail.' },
  { icon: '🔒', title: 'Security Minded',    desc: 'Best practices baked in from the start.' },
  { icon: '🤝', title: 'Collaboration',      desc: 'Clear communication and transparent process.' },
];

export default function About() {
  const [profile, setProfile] = useState(null);
  const [exp, setExp] = useState([]);
  const [edu, setEdu] = useState([]);

  useEffect(() => {
    getProfile().then(r => setProfile(r.data?.data || null)).catch(() => {});
    experienceAPI.getAll().then(r => setExp(r.data?.data || [])).catch(() => {});
    educationAPI.getAll().then(r => setEdu(r.data?.data || [])).catch(() => {});
  }, []);

  const initial = (profile?.name || 'P')[0]?.toUpperCase();

  return (
    <MasterLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '60px 28px 100px' }}>

        {/* Header */}
        <FadeIn delay={0}>
          <div style={{ marginBottom: 64, maxWidth: 640 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>About Me</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: 'var(--text)', lineHeight: 1.15, marginBottom: 20 }}>
              Building the web,<br/>one line at a time
            </h1>
            <p style={{ fontSize: 16, color: 'var(--muted2)', lineHeight: 1.75 }}>
              {profile?.bio || `I'm a passionate full-stack developer crafting digital experiences that are fast, accessible, and beautiful. I thrive at the intersection of code and design.`}
            </p>
          </div>
        </FadeIn>

        {/* Bio grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: 48, alignItems: 'start', marginBottom: 96 }} className="about-grid">
          <FadeIn delay={0.1}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 24, padding: 36, position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'var(--gold-dim)' }} />
              <div style={{
                width: 100, height: 100, borderRadius: '50%',
                background: 'linear-gradient(135deg,var(--gold-dim),var(--bg3))',
                border: '2px solid var(--gold)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--serif)', fontSize: 40, color: 'var(--gold)', fontWeight: 700,
                marginBottom: 20, position: 'relative', overflow: 'hidden',
              }}>
                {profile?.picture
                  ? <img src={resolveImg(profile.picture)} alt={profile.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                  : initial
                }
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>
                {profile?.name || 'Portfolio Owner'}
              </div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>
                {profile?.title || 'Full-Stack Developer'}
              </div>
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: 8, width: '100%', justifyContent: 'center', borderRadius: 10 }}>
                Get In Touch
              </Link>
            </div>
          </FadeIn>

          <div>
            <FadeIn delay={0.2}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>Core Values</div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }} className="values-grid">
                {VALUES.map((v, i) => (
                  <div key={v.title} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '16px 18px', animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${0.25 + i*0.06}s both` }}>
                    <div style={{ fontSize: 22, marginBottom: 8 }}>{v.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{v.title}</div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>{v.desc}</div>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>

        {/* Experience timeline (from API) */}
        {exp.length > 0 && (
          <>
            <FadeIn delay={0.05}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Journey</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700, color: 'var(--text)' }}>Experience</h2>
              </div>
            </FadeIn>

            <div style={{ position: 'relative', paddingLeft: 32, marginBottom: 80 }}>
              <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--gold) 0%, transparent 100%)', opacity: 0.3 }} />
              {exp.map((item, i) => (
                <FadeIn key={item._id} delay={0.1 + i * 0.06}>
                  <div style={{ position: 'relative', paddingBottom: 32 }}>
                    <div style={{ position: 'absolute', left: -38, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--gold)', border: '2px solid var(--bg)', boxShadow: '0 0 0 3px var(--gold-dim)' }} />
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', marginBottom: 6, letterSpacing: '0.08em' }}>{item.time}</div>
                    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--gold)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', marginBottom: 10 }}>{item.company}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6 }}>{item.description}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </>
        )}

        {/* Education timeline (from API) */}
        {edu.length > 0 && (
          <>
            <FadeIn delay={0.05}>
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Academic</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700, color: 'var(--text)' }}>Education</h2>
              </div>
            </FadeIn>

            <div style={{ position: 'relative', paddingLeft: 32 }}>
              <div style={{ position: 'absolute', left: 0, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg, var(--info) 0%, transparent 100%)', opacity: 0.3 }} />
              {edu.map((item, i) => (
                <FadeIn key={item._id} delay={0.1 + i * 0.06}>
                  <div style={{ position: 'relative', paddingBottom: 32 }}>
                    <div style={{ position: 'absolute', left: -38, top: 4, width: 12, height: 12, borderRadius: '50%', background: 'var(--info)', border: '2px solid var(--bg)', boxShadow: '0 0 0 3px rgba(82,148,168,0.15)' }} />
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--info)', marginBottom: 6, letterSpacing: '0.08em' }}>{item.time}</div>
                    <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px' }}>
                      <div style={{ fontFamily: 'var(--serif)', fontSize: 17, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>{item.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--info)', fontFamily: 'var(--mono)', letterSpacing: '0.08em', marginBottom: 10 }}>{item.institute}</div>
                      <div style={{ fontSize: 13, color: 'var(--muted2)', lineHeight: 1.6 }}>{item.description}</div>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </>
        )}
      </div>

      <style>{`
        @media (max-width: 768px) {
          .about-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .values-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </MasterLayout>
  );
}
