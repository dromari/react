'use client';

import { ReactNode } from 'react';
import { useTheme } from '@/hooks/useTheme';
import styles from '@/app/[locale]/page.module.css';

interface ThemeContainerProps {
  children: ReactNode;
}

export default function ThemeContainer({ children }: ThemeContainerProps) {
  const { theme } = useTheme();

  const wrapperClass =
    theme === 'dark'
      ? `${styles.mainWrapper} ${styles.darkTheme}`
      : styles.mainWrapper;

  return <div className={wrapperClass}>{children}</div>;
}
