'use client';

import { useEffect } from 'react';
import styles from '@/app/[locale]/error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Caught by Next.js Error Boundary:', error);
  }, [error]);

  return (
    <div className={styles.errorScreen}>
      <h2>SYSTEM ERROR</h2>
      <p>Something went wrong...</p>

      <button className={styles.resetButton} onClick={() => reset()}>
        Reboot System
      </button>
    </div>
  );
}
