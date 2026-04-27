import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import {
  advantageAPI, testimonialAPI, getProfile, resolveImg,
} from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return (
    <div style={{ animation: `pageEnter 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>
      {children}
    </div>
  );
}

function CountUp({ end, duration = 1800, suffix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      setCount(Math.round((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    const t = setTimeout(() => requestAnimationFrame(step), 400);
    return () => clearTimeout(t);
  }, [end, duration]);
  return <>{count}{suffix}</>;
}

const STATIC_SKILLS = [
  { name: 'React / Next.js',      pct: 92 },
  { name: 'Node.js / Express',    pct: 88 },
  { name: 'MongoDB / PostgreSQL', pct: 80 },
  { name: 'UI / UX Design',       pct: 75 },
  { name: 'TypeScript',           pct: 82 },
  { name: 'DevOps / Docker',      pct: 68 },
];

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getProfile().then(r => setProfile(r.data?.data || null)).catch(() => {});
    advantageAPI.getAll().then(r => {
      const d = r.data?.data || [];
      setSkills(d.map(a => ({ name: a.title, pct: Number(a.percent) || 0, category: a.category })));
    }).catch(() => {});
    testimonialAPI.getAll().then(r => setTestimonials(r.data?.data || [])).catch(() => {});
  }, []);

  const skillsToShow = skills.length ? skills : STATIC_SKILLS;
  const ownerName = profile?.name || 'Portfolio Owner';
  const ownerTitle = profile?.title || 'Full-Stack Developer';

  // Duplicate testimonials so the marquee scrolls seamlessly
  const marqueeItems = testimonials.length
    ? [...testimonials, ...testimonials]
    : [];

  const STATS = [
    { label: 'Skills',       value: skillsToShow.length, suffix: '+' },
    { label: 'Testimonials', value: testimonials.length, suffix: ''  },
    { label: 'Years Exp.',   value: 6,  suffix: '+' },
    { label: 'Projects',     value: 24, suffix: '+' },
  ];

  return (
    <MasterLayout>
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 28px' }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="hero-section" style={{ minHeight: '88vh', display: 'flex', alignItems: 'center', paddingTop: 40, paddingBottom: 80, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.07) 0%, transparent 70%)', filter: 'blur(40px)' }} />
            <div style={{ position: 'absolute', bottom: '5%', left: '-5%', width: 350, height: 350, borderRadius: '50%', background: 'radial-gradient(circle, rgba(82,148,168,0.05) 0%, transparent 70%)', filter: 'blur(50px)' }} />
          </div>

          <div className="hero-grid" style={{ position: 'relative', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 60, alignItems: 'center' }}>
            <div>
              <FadeIn delay={0}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 100, padding: '6px 16px', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 24 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
                  Available for work
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(36px,5vw,62px)', fontWeight: 700, lineHeight: 1.1, color: 'var(--text)', marginBottom: 24 }}>
                  Hi, I'm{' '}
                  <span style={{ color: 'var(--gold)' }}>{ownerName.split(' ')[0]}</span>
                  <br />
                  <span style={{ color: 'var(--muted2)' }}>{ownerTitle}</span>
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <p style={{ fontSize: 16, color: 'var(--muted2)', lineHeight: 1.75, marginBottom: 36, maxWidth: 480 }}>
                  {profile?.bio || `I craft modern, performant web experiences with clean code and thoughtful design. Specializing in full-stack MERN applications.`}
                </p>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/portfolio" className="btn btn-primary" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 10 }}>View My Work</Link>
                  <Link to="/contact" className="btn btn-outline" style={{ padding: '12px 28px', fontSize: 14, borderRadius: 10 }}>Get In Touch</Link>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.25} style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 370, background: 'linear-gradient(135deg,var(--bg2) 0%,var(--bg3) 100%)', border: '1px solid var(--border)', borderRadius: 24, padding: 32, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'var(--gold-dim)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(82,148,168,0.08)' }} />

                <div style={{ position: 'relative', marginBottom: 20 }}>
                  <div style={{
                    width: 96, height: 96, borderRadius: '50%',
                    background: 'linear-gradient(135deg,var(--gold-dim),var(--bg3))',
                    border: '2px solid var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--serif)', fontSize: 38, color: 'var(--gold)', fontWeight: 700,
                    overflow: 'hidden',
                  }}>
                    {profile?.picture
                      ? <img src={resolveImg(profile.picture)} alt={ownerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                      : ownerName[0].toUpperCase()
                    }
                  </div>
                  <div style={{ position: 'absolute', bottom: 4, left: 78, width: 18, height: 18, borderRadius: '50%', background: 'var(--success)', border: '2px solid var(--bg2)' }} />
                </div>

                <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{ownerName}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 20 }}>{ownerTitle}</div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {['⚡ React · Node.js · MongoDB', '🎨 UI/UX · Figma · CSS', '☁️ AWS · Docker · CI/CD'].map(t => (
                    <div key={t} style={{ fontSize: 13, color: 'var(--muted2)' }}>{t}</div>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <section style={{ padding: '60px 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 80 }}>
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 32 }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${0.1 + i * 0.08}s both` }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 44, fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 8 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 100 }}>
          <FadeIn delay={0.05}>
            <div style={{ marginBottom: 48 }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Expertise</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700, color: 'var(--text)' }}>Technical Skills</h2>
            </div>
          </FadeIn>

          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            {skillsToShow.map((skill, i) => (
              <FadeIn key={skill.name + i} delay={0.1 + i * 0.06}>
                <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 12, padding: '18px 22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
                    <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>{skill.name}</span>
                    <span style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)', fontWeight: 600 }}>{skill.pct}%</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--bg3)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${skill.pct}%`, background: 'linear-gradient(90deg,var(--gold),var(--gold-light))', borderRadius: 2, animation: `growWidth 1.2s cubic-bezier(0.4,0,0.2,1) ${0.4 + i * 0.1}s both` }} />
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* ── Testimonials marquee ──────────────────────────────── */}
        {testimonials.length > 0 && (
          <section style={{ paddingBottom: 100 }}>
            <FadeIn delay={0.05}>
              <div style={{ marginBottom: 32, textAlign: 'center' }}>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 8 }}>Kind words</div>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700, color: 'var(--text)' }}>What clients say</h2>
              </div>
            </FadeIn>

            <div style={{ position: 'relative', overflow: 'hidden', maskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)', WebkitMaskImage: 'linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)' }}>
              <div className="marquee">
                {marqueeItems.map((t, i) => (
                  <div key={`${t._id}-${i}`} style={{ flex: '0 0 360px', background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 16, padding: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 32, color: 'var(--gold)', lineHeight: 0.6, height: 14 }}>“</div>
                    <div style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.7, fontStyle: 'italic' }}>
                      {t.feedback}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 8, borderTop: '1px solid var(--border)' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--gold-dim)', border: '1px solid var(--gold)', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', color: 'var(--gold)', fontWeight: 700, flexShrink: 0 }}>
                        {t.img
                          ? <img src={resolveImg(t.img)} alt={t.clientName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                          : (t.clientName?.[0] || '?').toUpperCase()
                        }
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{t.clientName}</div>
                        <div style={{ fontSize: 11, color: 'var(--muted)', fontFamily: 'var(--mono)' }}>{t.address}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 100 }}>
          <FadeIn delay={0.1}>
            <div style={{ background: 'linear-gradient(135deg,var(--bg2) 0%,var(--bg3) 100%)', border: '1px solid var(--border)', borderRadius: 24, padding: '60px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 36, fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Let's Build Something <span style={{ color: 'var(--gold)' }}>Amazing</span></h2>
                <p style={{ fontSize: 15, color: 'var(--muted2)', marginBottom: 32, maxWidth: 480, margin: '0 auto 32px' }}>Have a project in mind? I'd love to hear about it. Let's create something extraordinary together.</p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/contact" className="btn btn-primary" style={{ padding: '12px 32px', fontSize: 14, borderRadius: 10 }}>Start a Project</Link>
                  <Link to="/about" className="btn btn-outline" style={{ padding: '12px 32px', fontSize: 14, borderRadius: 10 }}>Learn More</Link>
                </div>
              </div>
            </div>
          </FadeIn>
        </section>
      </div>

      <style>{`
        @keyframes growWidth { from { width: 0 } }
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 32px !important; }
          .stats-row { grid-template-columns: repeat(2,1fr) !important; }
          .skills-grid { grid-template-columns: 1fr !important; }
          .hero-section { min-height: auto !important; padding-top: 24px !important; padding-bottom: 48px !important; }
        }
      `}</style>
    </MasterLayout>
  );
}
