'use client';

import { Link } from '@/i18n/routing';
import styles from '@/app/[locale]/not-found.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.errorCode}>404</div>
      <p className={styles.message}>
        The page you are looking for does not exist.
      </p>

      <Link href="/" className={styles.homeButton}>
        Return to Main App
      </Link>
    </div>
  );
}
