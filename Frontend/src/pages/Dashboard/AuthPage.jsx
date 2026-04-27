import { useState } from "react";
import { useAuth } from "../../context/AuthContext";

export default function AuthPage() {
  const { login, error, setError } = useAuth();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      await login({ email, password: pass });
    } catch (ex) {
      setError(ex.response?.data?.message || "Invalid email or password");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-wrap">
      {/* Background orbs */}
      <div
        style={{
          position: "absolute",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 65%)",
          top: -200,
          right: -150,
          pointerEvents: "none",
          filter: "blur(20px)",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 400,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(82,148,168,0.06) 0%, transparent 65%)",
          bottom: -150,
          left: -100,
          pointerEvents: "none",
          filter: "blur(30px)",
        }}
      />

      <div className="auth-card">
        {/* Logo mark */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 44,
              height: 44,
              background: "var(--gold-dim)",
              border: "1px solid var(--gold)",
              borderRadius: 12,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span
              style={{
                fontFamily: "var(--serif)",
                fontSize: 20,
                color: "var(--gold)",
                fontWeight: 700,
              }}
            >
              P
            </span>
          </div>
          <div>
            <div className="auth-logo" style={{ marginBottom: 0 }}>
              Portfolio CMS
            </div>
            <div
              style={{
                fontFamily: "var(--mono)",
                fontSize: 9,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "var(--muted)",
              }}
            >
              Admin Panel
            </div>
          </div>
        </div>

        <div style={{ marginBottom: 28 }}>
          <div
            style={{
              fontFamily: "var(--serif)",
              fontSize: 22,
              color: "var(--text)",
              marginBottom: 4,
            }}
          >
            Welcome back
          </div>
          <div style={{ fontSize: 13, color: "var(--muted)" }}>
            Sign in to manage your portfolio
          </div>
        </div>

        {error && <div className="error-banner">{error}</div>}

        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", flexDirection: "column", gap: 16 }}
        >
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              required
              autoFocus
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={busy}
            style={{
              marginTop: 4,
              justifyContent: "center",
              padding: "11px 20px",
              fontSize: 14,
              borderRadius: 8,
            }}
          >
            {busy ? (
              <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span
                  className="spin"
                  style={{ width: 16, height: 16, borderWidth: 1.5 }}
                />
                Signing in…
              </span>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div className="auth-toggle" style={{ fontSize: 11, color: "var(--muted)" }}>
          Admin access only
        </div>
      </div>
    </div>
  );
}
