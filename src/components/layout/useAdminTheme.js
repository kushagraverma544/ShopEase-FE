import { useEffect, useState } from 'react';

const STORAGE_KEY = 'shopease.admin-theme';

function getInitialTheme() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
  } catch {
    // localStorage unavailable (private browsing, quota) — fall through to
    // the default below.
  }
  return 'light';
}

// Admin-only theme preference, persisted separately from the rest of the
// app (no other layout has a theme switch yet) — drives the `dark` class
// AdminLayout puts on its root element.
export function useAdminTheme() {
  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // best-effort persistence only
    }
  }, [theme]);

  function toggleTheme() {
    setTheme((current) => (current === 'dark' ? 'light' : 'dark'));
  }

  return [theme, toggleTheme];
}
