import { Link } from '@/i18n/routing';

import styles from '@/app/[locale]/about/about.module.css';

export default function AboutPage() {
  return (
    <div className={styles.aboutWrapper}>
      <h2 className={styles.title}>About Pokédex</h2>

      <div className={styles.infoBlock}>
        <p>
          <span className={styles.label}>Author:</span>{' '}
          <a
            href="https://github.com/dromari"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Dromari
          </a>
        </p>
        <p>
          <span className={styles.label}>Course:</span>{' '}
          <a
            href="https://rs.school"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            RS School React Course
          </a>
        </p>
      </div>

      <Link href="/" className={styles.backButton}>
        Back to App
      </Link>
    </div>
  );
}
