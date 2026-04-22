import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ThemeContext = createContext(null);

const FONTS = [
  { id: 'default',    label: 'DM Sans',          stack: "'DM Sans', system-ui, sans-serif" },
  { id: 'inter',      label: 'Inter',             stack: "'Inter', system-ui, sans-serif" },
  { id: 'playfair',   label: 'Playfair Display',  stack: "'Playfair Display', Georgia, serif" },
  { id: 'mono',       label: 'JetBrains Mono',    stack: "'JetBrains Mono', 'Courier New', monospace" },
  { id: 'poppins',    label: 'Poppins',           stack: "'Poppins', system-ui, sans-serif" },
  { id: 'raleway',    label: 'Raleway',           stack: "'Raleway', system-ui, sans-serif" },
];

export { FONTS };

export function ThemeProvider({ children }) {
  const [mode, setMode]   = useState(() => localStorage.getItem('theme-mode') || 'dark');
  const [fontId, setFontId] = useState(() => localStorage.getItem('theme-font') || 'default');

  const applyTheme = useCallback((m, fId) => {
    const root = document.documentElement;
    root.setAttribute('data-theme', m);

    const font = FONTS.find(f => f.id === fId) || FONTS[0];
    root.style.setProperty('--sans', font.stack);

    // Light mode overrides
    if (m === 'light') {
      root.style.setProperty('--bg',        '#f5f4f0');
      root.style.setProperty('--bg2',       '#ffffff');
      root.style.setProperty('--bg3',       '#f0efe9');
      root.style.setProperty('--border',    'rgba(0,0,0,0.08)');
      root.style.setProperty('--border2',   'rgba(0,0,0,0.14)');
      root.style.setProperty('--text',      '#1a1814');
      root.style.setProperty('--muted',     '#9a9590');
      root.style.setProperty('--muted2',    '#5a5650');
    } else {
      root.style.setProperty('--bg',        '#0d0e11');
      root.style.setProperty('--bg2',       '#13141a');
      root.style.setProperty('--bg3',       '#1a1c24');
      root.style.setProperty('--border',    'rgba(255,255,255,0.07)');
      root.style.setProperty('--border2',   'rgba(255,255,255,0.12)');
      root.style.setProperty('--text',      '#e8e6e0');
      root.style.setProperty('--muted',     '#7a7870');
      root.style.setProperty('--muted2',    '#a09d98');
    }
  }, []);

  useEffect(() => {
    applyTheme(mode, fontId);
  }, [mode, fontId, applyTheme]);

  const toggleMode = () => {
    const next = mode === 'dark' ? 'light' : 'dark';
    setMode(next);
    localStorage.setItem('theme-mode', next);
  };

  const setFont = (id) => {
    setFontId(id);
    localStorage.setItem('theme-font', id);
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleMode, fontId, setFont, fonts: FONTS }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
