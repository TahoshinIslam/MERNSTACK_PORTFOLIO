import { useState } from 'react';
import MasterLayout from './layout/MasterLayout';
import { contactAPI } from '../api';

function FadeIn({ children, delay = 0, style = {} }) {
  return <div style={{ animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${delay}s both`, ...style }}>{children}</div>;
}

const CONTACT_INFO = [
  { icon: '📧', label: 'Email',    value: 'hello@portfolio.dev',     link: 'mailto:hello@portfolio.dev' },
  { icon: '📍', label: 'Location', value: 'Dhaka, Bangladesh',        link: null },
  { icon: '⏰', label: 'Response', value: 'Within 24 hours',          link: null },
  { icon: '💼', label: 'LinkedIn', value: 'linkedin.com/in/portfolio', link: 'https://linkedin.com' },
];

export default function Contact() {
  const [form,    setForm]    = useState({ name: '', email: '', subject: '', message: '' });
  const [sending, setSending] = useState(false);
  const [sent,    setSent]    = useState(false);
  const [error,   setError]   = useState('');

  const update = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) { setError('Please fill in all required fields.'); return; }
    setError('');
    setSending(true);
    try {
      await contactAPI.create(form);
      setSent(true);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally { setSending(false); }
  };

  return (
    <MasterLayout>
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: '60px 28px 100px' }}>

        <FadeIn delay={0}>
          <div style={{ marginBottom: 60 }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 12 }}>Contact</div>
            <h1 style={{ fontFamily: 'var(--serif)', fontSize: 'clamp(32px,4vw,52px)', fontWeight: 700, color: 'var(--text)', marginBottom: 16 }}>Get In Touch</h1>
            <p style={{ fontSize: 15, color: 'var(--muted2)', maxWidth: 500, lineHeight: 1.7 }}>
              Have a project in mind, a question, or just want to say hi? I'd love to hear from you.
            </p>
          </div>
        </FadeIn>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: 48, alignItems: 'start' }}>

          {/* Left — info */}
          <div>
            <FadeIn delay={0.1}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 36 }}>
                {CONTACT_INFO.map((info, i) => (
                  <div key={info.label} style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14, animation: `pageEnter 0.5s cubic-bezier(0.4,0,0.2,1) ${0.15 + i * 0.06}s both` }}>
                    <div style={{ width: 40, height: 40, borderRadius: 10, background: 'var(--gold-dim)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, flexShrink: 0 }}>{info.icon}</div>
                    <div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 3 }}>{info.label}</div>
                      {info.link
                        ? <a href={info.link} style={{ fontSize: 13, color: 'var(--gold)', textDecoration: 'none', fontWeight: 500 }}>{info.value}</a>
                        : <div style={{ fontSize: 13, color: 'var(--text)', fontWeight: 500 }}>{info.value}</div>
                      }
                    </div>
                  </div>
                ))}
              </div>
            </FadeIn>

            {/* Social links */}
            <FadeIn delay={0.3}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 14 }}>Follow Me</div>
              <div style={{ display: 'flex', gap: 10 }}>
                {['Twitter', 'GitHub', 'LinkedIn', 'Dribbble'].map(s => (
                  <a key={s} href="#" style={{ width: 38, height: 38, borderRadius: 10, background: 'var(--bg2)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, textDecoration: 'none', transition: 'border-color 0.2s' }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--gold)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}
                    title={s}
                  >
                    {s === 'Twitter' ? '𝕏' : s === 'GitHub' ? '⌥' : s === 'LinkedIn' ? 'in' : '◉'}
                  </a>
                ))}
              </div>
            </FadeIn>
          </div>

          {/* Right — form */}
          <FadeIn delay={0.15}>
            <div style={{ background: 'var(--bg2)', border: '1px solid var(--border)', borderRadius: 20, padding: 36 }}>
              {sent ? (
                <div style={{ textAlign: 'center', padding: '40px 20px' }}>
                  <div style={{ fontSize: 52, marginBottom: 20 }}>✉️</div>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 24, fontWeight: 700, color: 'var(--text)', marginBottom: 12 }}>Message Sent!</div>
                  <p style={{ fontSize: 14, color: 'var(--muted2)', lineHeight: 1.7, marginBottom: 28 }}>
                    Thank you for reaching out. I'll get back to you within 24 hours.
                  </p>
                  <button className="btn btn-outline" onClick={() => { setSent(false); setForm({ name:'', email:'', subject:'', message:'' }); }}>
                    Send Another
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
                  <div style={{ fontFamily: 'var(--serif)', fontSize: 20, fontWeight: 600, color: 'var(--text)', marginBottom: 4 }}>Send a Message</div>

                  {error && <div className="error-banner">{error}</div>}

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                    <div className="form-group">
                      <label>Name *</label>
                      <input type="text" value={form.name} onChange={update('name')} placeholder="Your name" required />
                    </div>
                    <div className="form-group">
                      <label>Email *</label>
                      <input type="email" value={form.email} onChange={update('email')} placeholder="your@email.com" required />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Subject</label>
                    <input type="text" value={form.subject} onChange={update('subject')} placeholder="What's this about?" />
                  </div>

                  <div className="form-group">
                    <label>Message *</label>
                    <textarea
                      value={form.message}
                      onChange={update('message')}
                      placeholder="Tell me about your project…"
                      required
                      style={{ minHeight: 140 }}
                    />
                  </div>

                  <button
                    className="btn btn-primary"
                    type="submit"
                    disabled={sending}
                    style={{ justifyContent: 'center', padding: '13px 24px', fontSize: 14, borderRadius: 10 }}
                  >
                    {sending ? (
                      <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span className="spin" style={{ width: 16, height: 16, borderWidth: 1.5 }} />
                        Sending…
                      </span>
                    ) : 'Send Message →'}
                  </button>
                </form>
              )}
            </div>
          </FadeIn>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="grid-template-columns: 1fr 1.5fr"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </MasterLayout>
  );
}
