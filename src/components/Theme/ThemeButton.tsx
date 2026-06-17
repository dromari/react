'use client';

import { useTheme } from '@/hooks/useTheme';
import styles from '@/components/Theme/ThemeButton.module.css';

export default function ThemeButton() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      className={styles.themeButton}
      onClick={toggleTheme}
      title="Switch Theme"
    >
      {theme === 'light' ? 'DARK' : 'LIGHT'}
    </button>
  );
}
