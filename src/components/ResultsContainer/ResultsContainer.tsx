import { Component } from 'react';
import { fetchDetailedPokemons, PokemonListItem } from '../../services/api';
import styles from './Results.module.css';

interface Props {
  searchTerm: string;
}

interface State {
  pokemons: PokemonListItem[];
  isLoading: boolean;
  errorMessage: string | null;
}

class ResultsContainer extends Component<Props, State> {
  state: State = {
    pokemons: [],
    isLoading: false,
    errorMessage: null,
  };

  componentDidMount() {
    this.loadData();
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.searchTerm !== prevProps.searchTerm) {
      this.loadData();
    }
  }

  loadData = async () => {
    this.setState({ isLoading: true, errorMessage: null });

    const result = await fetchDetailedPokemons(this.props.searchTerm);

    if (result && 'isError' in result) {
      const errorText = result.status
        ? `Error ${result.status}: ${result.message}`
        : `System Error: ${result.message}`;

      this.setState({
        isLoading: false,
        errorMessage: errorText,
      });
    } else if (result.length === 0) {
      this.setState({
        isLoading: false,
        pokemons: [],
        errorMessage: null,
      });
    } else {
      this.setState({
        pokemons: result as PokemonListItem[],
        isLoading: false,
        errorMessage: null,
      });
    }
  };

  render() {
    const { pokemons, isLoading, errorMessage } = this.state;

    return (
      <div className={styles.resultsArea}>
        <div className={styles.tableHeader}>
          <div className={styles.cellName}>NAME</div>
          <div className={styles.cellImage}>ICON</div>
          <div className={styles.cellData}>POKEDEX DATA</div>
        </div>

        <div>
          {isLoading && (
            <div className={styles.scanning}>SYSTEM SCANNING...</div>
          )}

          {errorMessage && !isLoading && (
            <div className={styles.errorBanner}>
              <h3>⚠️ DATABASE ERROR</h3>
              <p>{errorMessage}</p>
              <p>Please check your connection or try a different request.</p>
            </div>
          )}

          {!isLoading && !errorMessage && pokemons.length === 0 && (
            <div className={styles.errorBanner}>
              <h3>🔍 NO DATA FOUND</h3>
              <p>
                The Pokemon you are looking for does not exist in our database.
              </p>
            </div>
          )}

          {!isLoading &&
            !errorMessage &&
            pokemons.length > 0 &&
            pokemons.map((pokemon) => (
              <div key={pokemon.name} className={styles.tableRow}>
                <div className={styles.cellName}>
                  <strong>{pokemon.name}</strong>
                </div>
                <div className={styles.cellImage}>
                  {pokemon.image ? (
                    <img
                      src={pokemon.image}
                      alt={pokemon.name}
                      className={styles.pokemonSprite}
                    />
                  ) : (
                    <div className={styles.noImage}>?</div>
                  )}
                </div>
                <div className={styles.cellData}>
                  <span className={styles.descriptionText}>
                    {pokemon.description}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
    );
  }
}

export default ResultsContainer;
