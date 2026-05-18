import { useEffect, useState } from 'react';

export default function ThemeToggle() {
  const [dark, setDark] = useState(() => localStorage.getItem('theme') === 'dark');

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
    localStorage.setItem('theme', dark ? 'dark' : 'light');
  }, [dark]);

  return (
    <button className="btn-secondary h-11 px-3" onClick={() => setDark((value) => !value)} aria-label="Toggle theme">
      {dark ? 'Light' : 'Dark'}
    </button>
  );
}
