'use client';

import { ReactNode } from 'react';
import dynamic from 'next/dynamic';
import { useTheme } from '@/hooks/useTheme';
import styles from '@/app/[locale]/page.module.css';

interface ThemeContainerProps {
  children: ReactNode;
}

function ThemeContainerInner({ children }: ThemeContainerProps) {
  const { theme } = useTheme();

  const screenClass = theme === 'dark' ? styles.darkScreen : styles.lightScreen;
  const wrapperClass =
    theme === 'dark'
      ? `${styles.mainWrapper} ${styles.darkTheme}`
      : styles.mainWrapper;

  return (
    <div className={screenClass}>
      <div className={wrapperClass}>{children}</div>
    </div>
  );
}

const ThemeContainer = dynamic(() => Promise.resolve(ThemeContainerInner), {
  ssr: false,
});

export default ThemeContainer;
