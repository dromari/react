'use client';

import { useLocale } from 'next-intl';
import styles from '@/app/[locale]/not-found.module.css';
import ThemeContainer from '@/components/Theme/ThemeContainer';

export default function NotFoundPage() {
  const locale = useLocale();
  return (
    <ThemeContainer>
      <div className={styles.notFoundWrapper}>
        <div className={styles.errorCode}>404</div>
        <p className={styles.message}>
          The page you are looking for does not exist.
        </p>
        <a href={`/${locale}`} className={styles.homeButton}>
          Return to Main App
        </a>
      </div>
    </ThemeContainer>
  );
}
