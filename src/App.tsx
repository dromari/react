import { Component } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsContainer from './components/ResultsContainer/ResultsContainer';
import styles from './App.module.css';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';

interface AppState {
  searchTerm: string;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    const savedTerm = localStorage.getItem('pokeSearch') || '';
    this.state = {
      searchTerm: savedTerm,
    };
  }
  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    localStorage.setItem('pokeSearch', term);
  };
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

        <h1 className={styles.title}>Pokédex v1.0+</h1>

        <div className={styles.screenInner}>
          <SearchBar onSearch={this.handleSearch} />
          <ErrorBoundary>
            <ResultsContainer searchTerm={this.state.searchTerm} />
          </ErrorBoundary>
        </div>
      </div>
    );
  }
}

export default App;
