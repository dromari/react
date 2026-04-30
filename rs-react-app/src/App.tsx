import { Component } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsContainer from './components/ResultsContainer/ResultsContainer';
import styles from './App.module.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

class App extends Component {
  render() {
    return (
      <div className={styles.mainWrapper}>
        <button className={styles.errorButton} title="Test">
          Test
        </button>

        <div className={styles.smallLights}>
          <div className={styles.redLight} />
          <div className={styles.yellowLight} />
          <div className={styles.greenLight} />
        </div>

        <h1 className={styles.title}>Pokédex v1.0</h1>

        <div className={styles.screenInner}>
          <SearchBar />
          <ErrorBoundary>
            <ResultsContainer />
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

export default App;
