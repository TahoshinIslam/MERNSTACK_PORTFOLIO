import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { login, register, error, setError } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode]   = useState('login');
  const [email, setEmail] = useState('');
  const [pass,  setPass]  = useState('');
  const [busy,  setBusy]  = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit fired!', { mode, email, pass });
    setError('');
    setBusy(true);
    try {
      if (mode === 'login') {
        await login({ email, password: pass });
      } else {
        await register({ email, password: pass });
      }
      navigate('/admin');
    } catch (ex) {
      console.error('Auth error:', ex);
      setError(ex.response?.data?.message || 'Something went wrong');
    } finally {
      setBusy(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login');
    setError('');
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <div style={{
            width: 44, height: 44,
            background: 'var(--gold-dim)',
            border: '1px solid var(--gold)',
            borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontFamily: 'var(--serif)', fontSize: 20, color: 'var(--gold)', fontWeight: 700 }}>P</span>
          </div>
          <div>
            <div className="auth-logo" style={{ marginBottom: 0 }}>Portfolio CMS</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: 9, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--muted)' }}>
              Admin Panel
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: 'var(--serif)', fontSize: 22, color: 'var(--text)', marginBottom: 4 }}>
            {mode === 'login' ? 'Welcome back' : 'Create account'}
          </h2>
          <p style={{ fontSize: 13, color: 'var(--muted)' }}>
            {mode === 'login' ? 'Sign in to manage your portfolio' : 'Set up your admin account'}
          </p>
        </div>

        {error && (
          <div style={{ 
            background: 'rgba(224,82,82,0.15)', 
            border: '1px solid rgba(224,82,82,0.3)', 
            borderRadius: 8, 
            padding: 12, 
            marginBottom: 16, 
            color: '#dc2626' 
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              style={{ 
                padding: 12, 
                border: '1px solid var(--border)', 
                borderRadius: 8, 
                background: 'var(--bg2)', 
                color: 'var(--text)' 
              }}
              autoFocus
            />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <label style={{ fontSize: 13, fontWeight: 500, color: 'var(--text)' }}>Password</label>
            <input
              type="password"
              value={pass}
              onChange={e => setPass(e.target.value)}
              placeholder="••••••••"
              required
              style={{ 
                padding: 12, 
                border: '1px solid var(--border)', 
                borderRadius: 8, 
                background: 'var(--bg2)', 
                color: 'var(--text)' 
              }}
            />
          </div>
          <button
            type="submit"
            disabled={busy}
            style={{ 
              padding: '12px 24px', 
              background: 'var(--gold)', 
              color: '#0d0e11',
              border: 'none', 
              borderRadius: 8, 
              fontSize: 14, 
              fontWeight: 600,
              cursor: 'pointer',
              opacity: busy ? 0.7 : 1
            }}
          >
            {busy ? 'Processing...' : (mode === 'login' ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: 'var(--muted2)' }}>
          {mode === 'login' ? 'Don\'t have an account?' : 'Already have an account?'}&nbsp;
          <button
            type="button"
            onClick={toggleMode}
            style={{ 
              color: 'var(--gold)', 
              background: 'none', 
              border: 'none', 
              cursor: 'pointer', 
              fontWeight: 500,
              textDecoration: 'underline'
            }}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}
