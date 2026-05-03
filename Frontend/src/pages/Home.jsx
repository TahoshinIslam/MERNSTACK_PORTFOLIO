import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import MasterLayout from './layout/MasterLayout';
import MagicRings from '../components/MagicRings/MagicRings';
import {
  advantageAPI, testimonialAPI, getProfile, resolveImg,
} from '../api';
import {
  CodeIcon, PaletteIcon, CloudIcon,
} from '../components/Icons';

function FadeIn({ children, delay = 0, style = {} }) {
  return (
    <div style={{ animation: `pageEnter 0.6s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>
      {children}
    </div>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-quote">&ldquo;</div>
      <div className="testimonial-feedback">{t.feedback}</div>
      <div className="testimonial-meta">
        <div className="testimonial-avatar">
          {t.img
            ? <img src={resolveImg(t.img)} alt={t.clientName} onError={(e) => (e.target.style.display = 'none')} />
            : (t.clientName?.[0] || '?').toUpperCase()
          }
        </div>
        <div style={{ minWidth: 0 }}>
          <div className="testimonial-name">{t.clientName}</div>
          <div className="testimonial-where">{t.address}</div>
        </div>
      </div>
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

function Skeleton({ width = '100%', height = 16, radius = 6, style = {} }) {
  return (
    <span
      className="shimmer"
      style={{
        display: 'inline-block',
        width,
        height,
        borderRadius: radius,
        ...style,
      }}
    />
  );
}

export default function Home() {
  const [profile, setProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [skills, setSkills] = useState([]);
  const [testimonials, setTestimonials] = useState([]);

  useEffect(() => {
    getProfile()
      .then(r => setProfile(r.data?.data || null))
      .catch(() => {})
      .finally(() => setProfileLoading(false));
    advantageAPI.getAll().then(r => {
      const d = r.data?.data || [];
      setSkills(d.map(a => ({ name: a.title, pct: Number(a.percent) || 0, category: a.category })));
    }).catch(() => {});
    testimonialAPI.getAll().then(r => setTestimonials(r.data?.data || [])).catch(() => {});
  }, []);

  const skillsToShow = skills.length ? skills : STATIC_SKILLS;
  const ownerName = profile?.name || '';
  const ownerTitle = profile?.title || '';
  const firstName = ownerName.split(' ')[0];

  const STATS = [
    { label: 'Skills',       value: skillsToShow.length, suffix: '+' },
    { label: 'Testimonials', value: testimonials.length, suffix: ''  },
    { label: 'Years Exp.',   value: 6,  suffix: '+' },
    { label: 'Projects',     value: 24, suffix: '+' },
  ];

  return (
    <MasterLayout>
      <div className="home-wrap" style={{ maxWidth: 1440, margin: '0 auto', padding: '0 32px' }}>

        {/* ── Hero ──────────────────────────────────────────────── */}
        <section className="hero-section" style={{ minHeight: 'clamp(560px, 90vh, 880px)', display: 'flex', alignItems: 'center', paddingTop: 'clamp(32px, 5vw, 72px)', paddingBottom: 'clamp(60px, 8vw, 120px)', position: 'relative' }}>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100vw', pointerEvents: 'none', overflow: 'hidden', zIndex: 0 }}>
            <MagicRings
              color="#EAB308"
              colorTwo="#F97316"
              ringCount={6}
              speed={1}
              attenuation={10}
              lineThickness={2}
              baseRadius={0.35}
              radiusStep={0.1}
              scaleRate={0.1}
              opacity={1}
              blur={0}
              noiseAmount={0.1}
              rotation={0}
              ringGap={1.5}
              fadeIn={0.7}
              fadeOut={0.5}
              followMouse={true}
              mouseInfluence={0.2}
              hoverScale={1.2}
              parallax={0.05}
              clickBurst={true}
            />
          </div>

          <div className="hero-grid" style={{ position: 'relative', zIndex: 1, width: '100%', display: 'grid', gridTemplateColumns: '1.05fr 0.95fr', gap: 'clamp(40px, 6vw, 96px)', alignItems: 'center' }}>
            <div>
              <FadeIn delay={0}>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: 100, padding: '6px 16px', fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 24 }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--gold)' }} />
                  Available for work
                </div>
              </FadeIn>

              <FadeIn delay={0.1}>
                <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 6.2vw, 88px)', fontWeight: 700, lineHeight: 1.05, color: 'var(--text)', marginBottom: 28, letterSpacing: '-0.01em' }}>
                  {profileLoading ? (
                    <>
                      <Skeleton width="60%" height="1em" radius={10} />
                      <br />
                      <Skeleton width="75%" height="1em" radius={10} style={{ marginTop: 12 }} />
                    </>
                  ) : (
                    <>
                      Hi, I'm{' '}
                      <span style={{ color: 'var(--gold)' }}>{firstName}</span>
                      <br />
                      <span style={{ color: 'var(--muted2)' }}>{ownerTitle}</span>
                    </>
                  )}
                </h1>
              </FadeIn>

              <FadeIn delay={0.2}>
                <div style={{ marginBottom: 40, maxWidth: 560 }}>
                  {profileLoading ? (
                    <>
                      <Skeleton width="100%" height={14} style={{ marginBottom: 10 }} />
                      <Skeleton width="95%" height={14} style={{ marginBottom: 10 }} />
                      <Skeleton width="70%" height={14} />
                    </>
                  ) : (
                    <p style={{ fontSize: 'clamp(15px, 1.25vw, 19px)', color: 'var(--muted2)', lineHeight: 1.75, margin: 0 }}>
                      {profile?.bio || `I craft modern, performant web experiences with clean code and thoughtful design. Specializing in full-stack MERN applications.`}
                    </p>
                  )}
                </div>
              </FadeIn>

              <FadeIn delay={0.3}>
                <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
                  <Link to="/portfolio" className="btn btn-primary" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 12 }}>View My Work</Link>
                  <Link to="/contact" className="btn btn-outline" style={{ padding: '14px 32px', fontSize: 15, borderRadius: 12 }}>Get In Touch</Link>
                </div>
              </FadeIn>
            </div>

            <FadeIn delay={0.25} style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '100%', maxWidth: 460, background: 'linear-gradient(135deg,var(--bg2) 0%,var(--bg3) 100%)', border: '1px solid var(--border)', borderRadius: 28, padding: 'clamp(28px, 3vw, 44px)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -30, right: -30, width: 120, height: 120, borderRadius: '50%', background: 'var(--gold-dim)' }} />
                <div style={{ position: 'absolute', bottom: -20, left: -20, width: 80, height: 80, borderRadius: '50%', background: 'rgba(82,148,168,0.08)' }} />

                <div style={{ position: 'relative', marginBottom: 24 }}>
                  <div style={{
                    width: 120, height: 120, borderRadius: '50%',
                    background: 'linear-gradient(135deg,var(--gold-dim),var(--bg3))',
                    border: '2px solid var(--gold)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--serif)', fontSize: 48, color: 'var(--gold)', fontWeight: 700,
                    overflow: 'hidden',
                  }}>
                    {profileLoading
                      ? <Skeleton width="100%" height="100%" radius="50%" />
                      : profile?.picture
                        ? <img src={resolveImg(profile.picture)} alt={ownerName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                        : (ownerName[0] || '?').toUpperCase()
                    }
                  </div>
                  <div style={{ position: 'absolute', bottom: 6, left: 96, width: 22, height: 22, borderRadius: '50%', background: 'var(--success)', border: '3px solid var(--bg2)' }} />
                </div>

                {profileLoading ? (
                  <>
                    <Skeleton width="60%" height={22} style={{ marginBottom: 8 }} />
                    <div style={{ marginBottom: 24 }}><Skeleton width="45%" height={11} /></div>
                  </>
                ) : (
                  <>
                    <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 4 }}>{ownerName}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--gold)', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: 24 }}>{ownerTitle}</div>
                  </>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {profileLoading
                    ? [0, 1, 2].map(i => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <Skeleton width={15} height={15} radius={4} />
                          <Skeleton width={`${70 - i * 8}%`} height={13} />
                        </div>
                      ))
                    : [
                        { Icon: CodeIcon,    text: 'React · Node.js · MongoDB', color: '#c9a84c' },
                        { Icon: PaletteIcon, text: 'UI/UX · Figma · CSS',       color: '#a852a8' },
                        { Icon: CloudIcon,   text: 'AWS · Docker · CI/CD',      color: '#5294a8' },
                      ].map(({ Icon: Ic, text, color }) => (
                        <div key={text} style={{ fontSize: 13, color: 'var(--muted2)', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ color, display: 'inline-flex' }}><Ic size={15} /></span>
                          {text}
                        </div>
                      ))
                  }
                </div>
              </div>
            </FadeIn>
          </div>
        </section>

        {/* ── Stats ─────────────────────────────────────────────── */}
        <section style={{ padding: 'clamp(48px, 6vw, 80px) 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: 'clamp(60px, 8vw, 100px)' }}>
          <div className="stats-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 'clamp(24px, 3vw, 48px)' }}>
            {STATS.map((s, i) => (
              <div key={s.label} style={{ textAlign: 'center', animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${0.1 + i * 0.08}s both` }}>
                <div style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(40px, 4.5vw, 64px)', fontWeight: 700, color: 'var(--gold)', lineHeight: 1 }}>
                  <CountUp end={s.value} suffix={s.suffix} />
                </div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 10 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Skills ────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
          <FadeIn delay={0.05}>
            <div style={{ marginBottom: 'clamp(36px, 4vw, 60px)' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Expertise</div>
              <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px, 3.4vw, 52px)', fontWeight: 700, color: 'var(--text)' }}>Technical Skills</h2>
            </div>
          </FadeIn>

          <div className="skills-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'clamp(16px, 1.6vw, 24px)' }}>
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
        {testimonials.length > 0 && (() => {
          // Repeat the list inside each track until it's wide enough that
          // the row (= 2 tracks) always exceeds the viewport. Without this
          // a short list scrolls fully off-screen and creates a visible
          // snap when the animation loops back to start.
          // Card width ≈ 360px + 24px gap = 384px per item. Aim for ≥
          // ~2400px per track which covers most desktop viewports.
          const PER_TRACK_TARGET = 7;
          const repeats = Math.max(1, Math.ceil(PER_TRACK_TARGET / testimonials.length));
          const trackItems = Array.from({ length: repeats }).flatMap(() => testimonials);

          return (
            <section style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
              <FadeIn delay={0.05}>
                <div style={{ marginBottom: 'clamp(28px, 3.5vw, 48px)', textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 10 }}>Kind words</div>
                  <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px, 3.4vw, 52px)', fontWeight: 700, color: 'var(--text)' }}>What clients say</h2>
                </div>
              </FadeIn>

              <div className="marquee-viewport">
                <div className="marquee-row">
                  <div className="marquee-track">
                    {trackItems.map((t, i) => <TestimonialCard key={`a-${t._id}-${i}`} t={t} />)}
                  </div>
                  <div className="marquee-track" aria-hidden="true">
                    {trackItems.map((t, i) => <TestimonialCard key={`b-${t._id}-${i}`} t={t} />)}
                  </div>
                </div>
              </div>
            </section>
          );
        })()}

        {/* ── CTA ───────────────────────────────────────────────── */}
        <section style={{ paddingBottom: 'clamp(60px, 8vw, 120px)' }}>
          <FadeIn delay={0.1}>
            <div style={{ background: 'linear-gradient(135deg,var(--bg2) 0%,var(--bg3) 100%)', border: '1px solid var(--border)', borderRadius: 28, padding: 'clamp(40px, 6vw, 80px) clamp(24px, 4vw, 64px)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center top, rgba(201,168,76,0.06) 0%, transparent 60%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative' }}>
                <h2 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(30px, 3.4vw, 52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 18 }}>Let's Build Something <span style={{ color: 'var(--gold)' }}>Amazing</span></h2>
                <p style={{ fontSize: 'clamp(14px, 1vw, 17px)', color: 'var(--muted2)', maxWidth: 540, margin: '0 auto 36px', lineHeight: 1.7 }}>Have a project in mind? I'd love to hear about it. Let's create something extraordinary together.</p>
                <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
                  <Link to="/contact" className="btn btn-primary" style={{ padding: '14px 36px', fontSize: 15, borderRadius: 12 }}>Start a Project</Link>
                  <Link to="/about" className="btn btn-outline" style={{ padding: '14px 36px', fontSize: 15, borderRadius: 12 }}>Learn More</Link>
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
