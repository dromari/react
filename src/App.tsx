import { useState, MouseEvent } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsContainer from './components/ResultsContainer/ResultsContainer';
import Flyout from './components/Flyout/Flyout';
import { useLocalStorage } from './hooks/useLocalStorage';

import styles from './App.module.css';
import { useTheme } from './hooks/useTheme';

export default function App() {
  const [searchTerm, setSearchTerm] = useLocalStorage<string>('pokeSearch', '');
  const [shouldThrowError, setShouldThrowError] = useState(false);

  const navigate = useNavigate();
  const { detailsId } = useParams<{ detailsId: string }>();
  const { theme, toggleTheme } = useTheme();

  const queryClient = useQueryClient();

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleThrowError = () => {
    setShouldThrowError(true);
  };

  const handleRefreshCache = () => {
    queryClient.invalidateQueries({ queryKey: ['pokemons'] });
  };

  const handleMainPanelClick = (e: MouseEvent<HTMLDivElement>) => {
    if (detailsId && e.target === e.currentTarget) {
      navigate('/');
    }
  };

  if (shouldThrowError) {
    throw new Error('Test Error');
  }

  return (
    <div
      className={`${styles.mainWrapper} ${theme === 'dark' ? styles.darkTheme : ''}`}
      onClick={handleMainPanelClick}
    >
      <button
        className={styles.refreshButton}
        onClick={handleRefreshCache}
        title="Refresh Cache"
      >
        REFRESH
      </button>

      <button
        className={styles.themeButton}
        onClick={toggleTheme}
        title="Switch Theme"
      >
        {theme === 'light' ? 'DARK' : 'LIGHT'}
      </button>

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

      <div
        className={`${styles.screenInner} ${styles.splitLayout}`}
        onClick={handleMainPanelClick}
      >
        <div
          className={detailsId ? styles.leftColumn : styles.leftColumnFull}
          onClick={(e) => e.stopPropagation()}
        >
          <SearchBar onSearch={handleSearch} initialValue={searchTerm} />
          <ResultsContainer searchTerm={searchTerm} />
        </div>

        {detailsId && (
          <div
            className={styles.rightColumn}
            onClick={(e) => e.stopPropagation()}
          >
            <Outlet />
          </div>
        )}
      </div>
      <Flyout />
    </div>
  );
}
