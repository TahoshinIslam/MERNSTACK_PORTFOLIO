import { useState } from 'react';
import { updateUser, uploadFile } from '../../api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

export default function SettingsPage() {
  const { user } = useAuth();
  const toast = useToast();
  const [password, setPassword]       = useState('');
  const [saving,   setSaving]         = useState(false);
  const [uploading, setUploading]     = useState(false);
  const [fileResult, setFileResult]   = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (!password) return;
    setSaving(true);
    try {
      await updateUser({ password });
      toast('Password updated!', 'success');
      setPassword('');
    } catch(ex) {
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
    } catch(ex) {
      toast(ex.response?.data?.message || 'Upload failed', 'error');
    } finally { setUploading(false); }
  };

  return (
    <div>
      <div className="section-head">
        <div>
          <div className="section-title">Account Settings</div>
          <div className="section-count">Manage your profile</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, maxWidth: 800 }}>
        {/* Profile info */}
        <div className="card">
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
            Profile
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 20 }}>
            <div style={{ width: 52, height: 52, background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--gold)', fontWeight: 700 }}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={{ fontWeight: 500, color: 'var(--text)' }}>{user?.email}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 10, color: 'var(--muted)', marginTop: 2 }}>Administrator</div>
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
        </div>

        {/* File upload */}
        <div className="card">
          <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
            File Upload
          </div>
          <form onSubmit={handleFileUpload} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div
              className="file-upload-area"
              onClick={() => document.getElementById('file-input').click()}
            >
              <div style={{ fontSize: 24 }}>📎</div>
              <p>{selectedFile ? selectedFile.name : 'Click to select a file'}</p>
              <p style={{ fontSize: 11, marginTop: 4 }}>Images, PDFs, etc.</p>
              <input id="file-input" type="file" style={{ display: 'none' }} onChange={e => setSelectedFile(e.target.files[0])} />
            </div>
            {fileResult && (
              <div style={{ background: 'var(--bg3)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: 11, color: 'var(--success)', wordBreak: 'break-all' }}>
                ✓ {fileResult}
              </div>
            )}
            <button className="btn btn-primary" type="submit" disabled={uploading || !selectedFile}>
              {uploading ? 'Uploading…' : 'Upload File'}
            </button>
          </form>
        </div>
      </div>

      {/* API info */}
      <div className="card" style={{ marginTop: 20, maxWidth: 800 }}>
        <div style={{ fontFamily: 'var(--mono)', fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16 }}>
          API Information
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
          {[
            ['Base URL',   '/api/v1'],
            ['Auth',       'Cookie-based JWT'],
            ['File Store', '/api/v1/get-file/<filename>'],
            ['Rate Limit', '100 req / 15 min'],
          ].map(([k, v]) => (
            <div key={k} style={{ background: 'var(--bg3)', borderRadius: 'var(--radius)', padding: '10px 14px' }}>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>{k}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: 12, color: 'var(--gold)' }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
