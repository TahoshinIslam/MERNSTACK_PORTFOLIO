import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const { login, register, error } = useAuth();
  const navigate = useNavigate();
  const [mode,     setMode]     = useState('login');
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [loading,  setLoading]  = useState(false);
  const [err,      setErr]      = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (mode === 'login') await login({ email, password });
      else                  await register({ email, password });
      navigate('/');
    } catch(ex) {
      setErr(ex.response?.data?.message || 'Invalid credentials');
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-wrap">
      <div className="auth-card">
        <div className="auth-logo">Portfolio<br/>CMS</div>
        <div className="auth-sub">Content Management System</div>

        {err && <div className="error-banner">{err}</div>}

        <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit" disabled={loading}
            style={{ marginTop: 8, justifyContent: 'center', padding: '12px' }}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        <div className="auth-toggle">
          {mode === 'login' ? (
            <>Don't have an account? <a onClick={() => setMode('register')}>Register</a></>
          ) : (
            <>Already have an account? <a onClick={() => setMode('login')}>Sign in</a></>
          )}
        </div>
      </div>
    </div>
  );
}
