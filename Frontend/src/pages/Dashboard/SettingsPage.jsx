import { useState } from 'react';
import { updateUser, uploadFile } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { useTheme, FONTS } from '../../context/ThemeContext';

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

export default function SettingsPage() {
  const { user }                    = useAuth();
  const toast                       = useToast();
  const { mode, toggleMode, fontId, setFont } = useTheme();

  const [password,     setPassword]     = useState('');
  const [saving,       setSaving]       = useState(false);
  const [uploading,    setUploading]    = useState(false);
  const [fileResult,   setFileResult]   = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSaving(true);
    try {
      await updateUser({ password });
      toast('Password updated successfully!', 'success');
      setPassword('');
    } catch (ex) {
      toast(ex.response?.data?.message || 'Update failed', 'error');
    } finally { setSaving(false); }
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append('file', selectedFile);
      const r = await uploadFile(fd);
      const url = r.data?.url || r.data?.data?.url || r.data?.path || JSON.stringify(r.data);
      setFileResult(url);
      toast('File uploaded!', 'success');
    } catch (ex) {
      toast(ex.response?.data?.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20, maxWidth: 820 }} className="page-animate">
      <div className="section-head">
        <div>
          <div className="section-title">Settings</div>
          <div className="section-count">Manage your account and appearance</div>
        </div>
      </div>

      {/* ── Appearance ─────────────────────────────────────────── */}
      <SectionCard title="Appearance" subtitle="Controls how the dashboard looks for all viewers">
        {/* Color Mode */}
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
                {mode === m && (
                  <div style={{
                    width: 6, height: 6, borderRadius: '50%',
                    background: 'var(--gold)',
                  }} />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Font */}
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
                  border: fontId === font.id ? 'none' : '1px solid var(--border2)',
                }} />
                <span style={{ fontFamily: font.stack }}>{font.label}</span>
                <span style={{ marginLeft: 'auto', fontFamily: 'var(--serif)', fontSize: 16, color: 'var(--muted)', opacity: 0.6 }}>Aa</span>
              </button>
            ))}
          </div>
          <div style={{ marginTop: 12, padding: '12px 16px', background: 'var(--bg3)', borderRadius: 'var(--radius)', border: '1px solid var(--border)' }}>
            <span style={{ fontSize: 12, color: 'var(--muted)' }}>Preview: </span>
            <span style={{ fontSize: 14, color: 'var(--text)', fontFamily: 'var(--sans)' }}>
              The quick brown fox jumps over the lazy dog.
            </span>
          </div>
        </div>
      </SectionCard>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        {/* ── Profile ────────────────────────────────────────────── */}
        <SectionCard title="Profile" subtitle="Your account credentials">
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{
              width: 52, height: 52,
              background: 'var(--gold-dim)',
              border: '1.5px solid var(--gold)',
              borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--gold)', fontWeight: 700,
              flexShrink: 0,
            }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text)', fontSize: 14 }}>{user?.email}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2, letterSpacing: '0.12em', textTransform: 'uppercase' }}>Administrator</div>
            </div>
          </div>

          <form onSubmit={handlePasswordUpdate} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="form-group">
              <label>New Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Enter new password"
              />
            </div>
            <button className="btn btn-primary" type="submit" disabled={saving || !password}>
              {saving ? 'Updating…' : 'Update Password'}
            </button>
          </form>
        </SectionCard>

        {/* ── File Upload ─────────────────────────────────────────── */}
        <SectionCard title="File Upload" subtitle="Upload images and assets">
          <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              className="file-upload-area"
              onClick={() => document.getElementById('file-input').click()}
            >
              <div style={{ fontSize: 28 }}>📎</div>
              <p style={{ fontWeight: 500 }}>{selectedFile ? selectedFile.name : 'Click to select a file'}</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>Images, PDFs, documents</p>
              <input
                id="file-input"
                type="file"
                style={{ display: 'none' }}
                onChange={e => setSelectedFile(e.target.files[0])}
              />
            </div>
            {fileResult && (
              <div style={{
                background: 'rgba(82,168,126,0.08)', border: '1px solid rgba(82,168,126,0.25)',
                borderRadius: 'var(--radius)', padding: '8px 12px',
                fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--success)',
                wordBreak: 'break-all',
              }}>
                ✓ {fileResult}
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={uploading || !selectedFile}>
              {uploading ? 'Uploading…' : 'Upload File'}
            </button>
          </form>
        </SectionCard>
      </div>

      {/* ── API Info ─────────────────────────────────────────────── */}
      <SectionCard title="API Information" subtitle="Connection details for developers">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Base URL',    '/api/v1'],
            ['Auth',        'Cookie-based JWT'],
            ['File Store',  '/api/v1/get-file/<filename>'],
            ['Rate Limit',  '100 req / 15 min'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{k}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)' }}>{v}</div>
            </div>
          ))}
        </div>
      </SectionCard>
    </div>
  );
}
