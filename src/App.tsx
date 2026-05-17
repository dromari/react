import { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsContainer from './components/ResultsContainer/ResultsContainer';
import { useLocalStorage } from './hooks/useLocalStorage';
import styles from './App.module.css';

export default function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('pokeSearch', '');
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleThrowError = () => {
    setShouldThrowError(true);
  };

  if (shouldThrowError) {
    throw new Error('Test Error');
  }

  return (
    <div className={styles.mainWrapper}>
      <button className={styles.aboutButton}>
        <Link to="/about" className={styles.navLinkAbout}>
          ABOUT
        </Link>
      </button>

      <button
        className={styles.errorButton}
        title="Test Error"
        onClick={handleThrowError}
      >
        TEST
      </button>

      <div className={styles.smallLights}>
        <div className={styles.redLight} />
        <div className={styles.yellowLight} />
        <div className={styles.greenLight} />
      </div>

      <h1 className={styles.title}>Pokédex v1.0</h1>

      <div className={`${styles.screenInner} ${styles.splitLayout}`}>
        <div className={styles.leftColumn}>
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <ResultsContainer searchTerm={searchTerm} />
        </div>

        <div className={styles.rightColumn}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
