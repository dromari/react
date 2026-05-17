import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { fetchDetailedPokemons, PokemonListItem } from '../../services/api';
import styles from './Results.module.css';

interface Props {
  searchTerm: string;
}

const ITEMS_PER_PAGE = 5;

export default function ResultsContainer({ searchTerm }: Props) {
  const [pokemons, setPokemons] = useState<PokemonListItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const currentPage = parseInt(searchParams.get('page') || '1', 10);

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setErrorMessage(null);

      const result = await fetchDetailedPokemons(searchTerm);

      if (result && 'isError' in result) {
        const errorText = result.status
          ? `Error ${result.status}: ${result.message}`
          : `System Error: ${result.message}`;
        setErrorMessage(errorText);
        setPokemons([]);
      } else if (result.length === 0) {
        setPokemons([]);
      } else {
        setPokemons(result as PokemonListItem[]);
      }
      setIsLoading(false);
    };

    loadData();
  }, [searchTerm]);

  const totalPages = Math.ceil(pokemons.length / ITEMS_PER_PAGE);
  const indexOfLastItem = currentPage * ITEMS_PER_PAGE;
  const indexOfFirstItem = indexOfLastItem - ITEMS_PER_PAGE;
  const currentItems = pokemons.slice(indexOfFirstItem, indexOfLastItem);

  const handlePageChange = (pageNumber: number) => {
    setSearchParams({ page: pageNumber.toString() });
  };

  const handleRowClick = (id: string | number) => {
    navigate(`pokemon/${id}`);
  };

  return (
    <div className={styles.resultsArea}>
      <div className={styles.tableHeader}>
        <div className={styles.cellName}>NAME</div>
        <div className={styles.cellImage}>ICON</div>
        <div className={styles.cellData}>POKEDEX DATA</div>
      </div>

      <div>
        {isLoading && <div className={styles.scanning}>SYSTEM SCANNING...</div>}

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
          currentItems.length > 0 &&
          currentItems.map((pokemon) => (
            <div
              key={pokemon.name}
              className={styles.tableRow}
              onClick={() => handleRowClick(pokemon.name)}
              style={{ cursor: 'pointer' }}
            >
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

      {!isLoading && !errorMessage && totalPages > 1 && (
        <div className={styles.paginationBlock}>
          <button
            disabled={currentPage === 1}
            onClick={() => handlePageChange(currentPage - 1)}
            className={styles.pageButton}
          >
            ◀ PREV
          </button>
          <span className={styles.pageInfo}>
            PAGE {currentPage} OF {totalPages}
          </span>
          <button
            disabled={currentPage === totalPages}
            onClick={() => handlePageChange(currentPage + 1)}
            className={styles.pageButton}
          >
            NEXT ▶
          </button>
        </div>
      )}
    </div>
  );
}
