'use client';

import { useEffect } from 'react';
import { useTranslations } from 'next-intl';
import styles from '@/app/[locale]/error.module.css';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const t = useTranslations('Errors');

  useEffect(() => {
    console.error('Caught by Next.js Error Boundary:', error);
  }, [error]);

  return (
    <div className={styles.errorScreen}>
      <h2>{t('title')}</h2>
      <p>{t('somethingWrong')}</p>

      <button className={styles.resetButton} onClick={() => reset()}>
        {t('reboot')}
      </button>
    </div>
  );
}
