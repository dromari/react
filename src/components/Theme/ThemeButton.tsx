'use client';

import { useTheme } from '@/hooks/useTheme';
import styles from '@/app/[locale]/page.module.css';

interface ThemeButtonProps {
  lightText: string;
  darkText: string;
}

export default function ThemeButton({ lightText, darkText }: ThemeButtonProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button className={styles.themeButton} onClick={toggleTheme}>
      {theme === 'dark' ? lightText : darkText}
    </button>
  );
}
