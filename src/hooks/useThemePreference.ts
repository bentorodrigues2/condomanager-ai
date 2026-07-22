
import { useEffect, useState } from 'react';
import { lightTheme, darkTheme } from '../theme';

export function useThemePreference() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem('condomanager-theme');
    if (stored === 'dark') setDarkMode(true);
    if (stored === 'light') setDarkMode(false);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('condomanager-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const theme = darkMode ? darkTheme : lightTheme;

  return { darkMode, setDarkMode, theme };
}
