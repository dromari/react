import { Component } from 'react';
import { fetchDetailedPokemons, PokemonListItem } from '../../services/api';
import styles from './Results.module.css';

interface Props {
  searchTerm: string;
}

interface State {
  pokemons: PokemonListItem[];
  isLoading: boolean;
}

class ResultsContainer extends Component<Props, State> {
  state: State = {
    pokemons: [],
    isLoading: false,
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
    this.setState({ isLoading: true });
    try {
      const data = await fetchDetailedPokemons(this.props.searchTerm);
      this.setState({ pokemons: data, isLoading: false });
    } catch (error) {
      console.error(error);
      this.setState({ pokemons: [], isLoading: false });
    }
  };

  render() {
    const { pokemons, isLoading } = this.state;

    return (
      <div className={styles.resultsArea}>
        <div className={styles.tableHeader}>
          <div className={styles.cellName}>NAME</div>
          <div className={styles.cellImage}>ICON</div>
          <div className={styles.cellData}>POKEDEX DATA</div>
        </div>

        <div className={styles.resultsBody}>
          {isLoading ? (
            <div className={styles.scanning}>SYSTEM SCANNING...</div>
          ) : pokemons && pokemons.length > 0 ? (
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
            ))
          ) : (
            <div className={styles.noData}>NO DATA FOUND IN DATABASE</div>
          )}
        </div>
      </div>
    );
  }
}

export default ResultsContainer;
