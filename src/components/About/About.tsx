import { Link } from 'react-router-dom';
import styles from './About.module.css';

export default function About() {
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

      <Link to="/" className={styles.backButton}>
        Back to App
      </Link>
    </div>
  );
}
