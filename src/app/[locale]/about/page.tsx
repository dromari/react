import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';
import styles from './about.module.css';

interface AboutProps {
  params: Promise<{ locale: string }>;
}

export default async function AboutPage({ params }: AboutProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'About' });

  return (
    <div className={styles.aboutWrapper}>
      <h2 className={styles.title}>{t('title')}</h2>

      <div className={styles.infoBlock}>
        <p>
          <span className={styles.label}>{t('author')}</span>{' '}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className={styles.link}
          >
            Dromari
          </a>
        </p>
        <p>
          <span className={styles.label}>{t('course')}</span>{' '}
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
        {t('backButton')}
      </Link>
    </div>
  );
}
