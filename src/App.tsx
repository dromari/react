import { Component } from 'react';
import SearchBar from './components/SearchBar/SearchBar';
import ResultsContainer from './components/ResultsContainer/ResultsContainer';
import styles from './App.module.css';

interface AppState {
  searchTerm: string;
  shouldThrowError: boolean;
}

class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    const savedTerm = localStorage.getItem('pokeSearch') || '';
    this.state = {
      searchTerm: savedTerm,
      shouldThrowError: false,
    };
  }

  handleSearch = (term: string) => {
    this.setState({ searchTerm: term });
    localStorage.setItem('pokeSearch', term);
  };

  handleThrowError = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('Test Error');
    }

    return (
      <div className={styles.mainWrapper}>
        <button
          className={styles.errorButton}
          title="Test Error"
          onClick={this.handleThrowError}
        >
          TEST
        </button>

        <div className={styles.smallLights}>
          <div className={styles.redLight} />
          <div className={styles.yellowLight} />
          <div className={styles.greenLight} />
        </div>

        <h1 className={styles.title}>Pokédex v1.0</h1>

        <div className={styles.screenInner}>
          <SearchBar onSearch={this.handleSearch} />
          <ResultsContainer searchTerm={this.state.searchTerm} />
        </div>
      </div>
    );
  }
}

export default App;
