import { useState, useEffect } from 'react';
import { updateUser, getUser, resolveImg } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme, FONTS } from '../../context/ThemeContext';
import FileDrop from '../../components/FileDrop';
import { SOCIAL_META } from '../../components/Icons';

function SectionCard({ title, subtitle, children }) {
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <div>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--gold)', marginBottom: 4 }}>
          {title}
        </div>
        {subtitle && <div style={{ fontSize: 12, color: 'var(--muted)' }}>{subtitle}</div>}
      </div>
      {children}
    </div>
  );
}

const SOCIAL_KEYS = Object.keys(SOCIAL_META);

export default function SettingsPage() {
  const { user, updateUserCache } = useAuth();
  const toast = useToast();
  const { mode, toggleMode, fontId, setFont } = useTheme();

  const [profile, setProfile] = useState({
    name: '', title: '', picture: '', bio: '', location: '', phone: '',
    socials: {},
  });
  const [savingProfile, setSavingProfile] = useState(false);

  const [password, setPassword] = useState('');
  const [savingPwd, setSavingPwd] = useState(false);

  useEffect(() => {
    if (!user) return;
    setProfile({
      name: user.name || '',
      title: user.title || '',
      picture: user.picture || '',
      bio: user.bio || '',
      location: user.location || '',
      phone: user.phone || '',
      socials: user.socials || {},
    });
  }, [user?._id || user?.id]);

  const setField = (k) => (v) =>
    setProfile(p => ({ ...p, [k]: typeof v === 'string' ? v : v.target.value }));

  const setSocial = (key, val) =>
    setProfile(p => ({ ...p, socials: { ...p.socials, [key]: val } }));

  const handleProfileSave = async (e) => {
    e?.preventDefault?.();
    setSavingProfile(true);
    try {
      await updateUser(profile);
      try {
        const me = await getUser();
        const u = me.data?.result?.[0];
        if (u) updateUserCache({ ...user, ...u });
      } catch {}
      toast('Profile updated successfully', 'success');
    } catch (ex) {
      toast(ex.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSavingPwd(true);
    try {
      await updateUser({ password });
      toast('Password updated successfully', 'success');
      setPassword('');
    } catch (ex) {
      toast(ex.response?.data?.message || 'Update failed', 'error');
    } finally {
      setSavingPwd(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 920 }} className="page-animate">
      <div className="section-head">
        <div>
          <div className="section-title">Settings</div>
          <div className="section-count">Manage your account, profile and appearance</div>
        </div>
      </div>

      {/* ── Admin profile ────────────────────────────────────────── */}
      <SectionCard title="Profile" subtitle="Shown on your public portfolio (Home, About, Contact)">
        <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 28, alignItems: 'start' }} className="settings-profile-grid">
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            <div style={{
              width: 200, height: 200, borderRadius: '50%',
              background: 'linear-gradient(135deg,var(--gold-dim),var(--bg3))',
              border: '2px solid var(--gold)',
              overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontSize: 64, color: 'var(--gold)', fontWeight: 700,
            }}>
              {profile.picture
                ? <img src={resolveImg(profile.picture)} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} onError={e => e.target.style.display='none'} />
                : (profile.name?.[0] || user?.email?.[0] || 'A').toUpperCase()
              }
            </div>
            <FileDrop
              mode="single"
              value={profile.picture}
              onChange={(v) => setProfile(p => ({ ...p, picture: v }))}
              label="Profile Picture"
              hint="Square images look best (≥ 400×400)"
              accept="image/*"
            />
          </div>

          <form onSubmit={handleProfileSave} style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
              <div className="form-group">
                <label>Display Name</label>
                <input type="text" value={profile.name} onChange={setField('name')} placeholder="e.g. Tahoshin Islam" />
              </div>
              <div className="form-group">
                <label>Professional Title</label>
                <input type="text" value={profile.title} onChange={setField('title')} placeholder="e.g. Full-Stack Developer" />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input type="text" value={profile.location} onChange={setField('location')} placeholder="e.g. Dhaka, Bangladesh" />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input type="tel" value={profile.phone} onChange={setField('phone')} placeholder="Optional" />
              </div>
            </div>
            <div className="form-group">
              <label>Short Bio</label>
              <textarea value={profile.bio} onChange={setField('bio')} placeholder="One or two sentences about yourself" rows={4} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)' }}>
              Email: <span style={{ color: 'var(--text)', fontFamily: 'var(--mono)' }}>{user?.email}</span>
            </div>
            <button className="btn btn-primary" type="submit" disabled={savingProfile} style={{ alignSelf: 'flex-start' }}>
              {savingProfile ? 'Saving…' : 'Save Profile'}
            </button>
          </form>
        </div>
      </SectionCard>

      {/* ── Social links ─────────────────────────────────────────── */}
      <SectionCard title="Social Links" subtitle="Visible on the public Contact page. Empty fields are hidden.">
        <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
          {SOCIAL_KEYS.map(key => {
            const meta = SOCIAL_META[key];
            const Icon = meta.Icon;
            return (
              <div key={key} className="form-group">
                <label style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 14, height: 14, color: meta.color, display: 'inline-flex' }}>
                    <Icon size={14} />
                  </span>
                  {meta.label}
                </label>
                <input
                  type="url"
                  value={profile.socials?.[key] || ''}
                  onChange={(e) => setSocial(key, e.target.value)}
                  placeholder={`https://${key === 'website' ? 'your-site.com' : `${key}.com/your-handle`}`}
                />
              </div>
            );
          })}
        </div>
        <button className="btn btn-primary" type="button" onClick={handleProfileSave} disabled={savingProfile} style={{ alignSelf: 'flex-start' }}>
          {savingProfile ? 'Saving…' : 'Save Social Links'}
        </button>
      </SectionCard>

      {/* ── Appearance ─────────────────────────────────────────── */}
      <SectionCard title="Appearance" subtitle="Controls how the dashboard looks">
        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 12 }}>Color Mode</div>
          <div style={{ display: 'flex', gap: 12 }}>
            {['dark', 'light'].map(m => (
              <button
                key={m}
                onClick={() => mode !== m && toggleMode()}
                style={{
                  flex: 1,
                  padding: '14px 20px',
                  borderRadius: 'var(--radius-lg)',
                  border: `1px solid ${mode === m ? 'var(--gold)' : 'var(--border)'}`,
                  background: mode === m ? 'var(--gold-dim)' : 'var(--bg3)',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                }}
              >
                <div style={{ fontSize: 22 }}>{m === 'dark' ? '🌙' : '☀️'}</div>
                <div style={{
                  fontFamily: 'var(--mono)', fontSize: 11, letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: mode === m ? 'var(--gold)' : 'var(--muted2)',
                  fontWeight: mode === m ? 600 : 400,
                }}>
                  {m === 'dark' ? 'Dark' : 'Light'}
                </div>
              </button>
            ))}
          </div>
        </div>

        <div>
          <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)', marginBottom: 12 }}>Interface Font</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {FONTS.map(font => (
              <button
                key={font.id}
                className={`font-option ${fontId === font.id ? 'selected' : ''}`}
                onClick={() => setFont(font.id)}
                style={{ fontFamily: font.stack }}
              >
                <span style={{
                  width: 8, height: 8, borderRadius: '50%', flexShrink: 0,
                  background: fontId === font.id ? 'var(--gold)' : 'var(--border2)',
                }} />
                <span style={{ fontFamily: font.stack }}>{font.label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--muted)', opacity: 0.6 }}>Aa</span>
              </button>
            ))}
          </div>
        </div>
      </SectionCard>

      {/* ── Password ──────────────────────────────────────────── */}
      <SectionCard title="Security" subtitle="Change your account password">
        <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 420 }}>
          <div className="form-group">
            <label>New Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Enter new password"
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={savingPwd || !password}>
            {savingPwd ? 'Updating…' : 'Update Password'}
          </button>
        </form>
      </SectionCard>

      <style>{`
        @media (max-width: 768px) {
          .settings-profile-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
