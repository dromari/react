import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundWrapper}>
      <div className={styles.errorCode}>404</div>
      <p className={styles.message}>
        The page you are looking for does not exist.
      </p>
      <Link to="/" className={styles.homeButton}>
        Return to Main App
      </Link>
    </div>
  );
}
