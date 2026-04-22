export default function InitLoader() {
  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 99999,
      background: 'var(--bg)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: 20,
    }}>
      {/* Animated logo mark */}
      <div style={{ position: 'relative', width: 60, height: 60 }}>
        {/* Outer ring */}
        <svg
          width="60" height="60"
          viewBox="0 0 60 60"
          style={{ position: 'absolute', inset: 0, animation: 'spin 2s linear infinite' }}
        >
          <circle
            cx="30" cy="30" r="26"
            fill="none"
            stroke="var(--gold)"
            strokeWidth="1.5"
            strokeDasharray="40 124"
            strokeLinecap="round"
          />
        </svg>

        {/* Counter-rotate ring */}
        <svg
          width="60" height="60"
          viewBox="0 0 60 60"
          style={{ position: 'absolute', inset: 0, animation: 'spin 1.5s linear infinite reverse' }}
        >
          <circle
            cx="30" cy="30" r="18"
            fill="none"
            stroke="rgba(201,168,76,0.3)"
            strokeWidth="1"
            strokeDasharray="20 93"
            strokeLinecap="round"
          />
        </svg>

        {/* Center letter */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontFamily: 'var(--serif)', fontSize: 22, fontWeight: 700, color: 'var(--gold)',
        }}>
          P
        </div>
      </div>

      {/* Label */}
      <div style={{
        fontFamily: 'var(--mono)',
        fontSize: 10,
        letterSpacing: '0.2em',
        textTransform: 'uppercase',
        color: 'var(--muted)',
        animation: 'pulse 1.5s ease-in-out infinite',
      }}>
        Loading…
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50%       { opacity: 1;   }
        }
      `}</style>
    </div>
  );
}
