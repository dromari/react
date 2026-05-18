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
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pageParam = searchParams.get('page');

  const isPageValid = pageParam === null || /^\d+$/.test(pageParam);

  const currentPage = isPageValid ? parseInt(pageParam || '1', 10) : 1;

  useEffect(() => {
    const loadData = async () => {
      if (!isPageValid) {
        navigate('/404', { replace: true });
        return;
      }

      setIsLoading(true);
      setErrorMessage(null);

      const result = await fetchDetailedPokemons(
        searchTerm,
        currentPage,
        ITEMS_PER_PAGE
      );

      if (result && 'isError' in result) {
        setErrorMessage(result.message);
        setPokemons([]);
        setTotalCount(0);
        setIsLoading(false);

        if (searchTerm !== 'error') {
          navigate('/404', { replace: true });
        }
        return;
      } else if (result && 'pokemons' in result) {
        setPokemons(result.pokemons);
        setTotalCount(result.count);

        const maxPages = Math.ceil(result.count / ITEMS_PER_PAGE);

        if (
          ((currentPage > maxPages && maxPages > 0) || currentPage < 1) &&
          searchTerm !== 'error'
        ) {
          setIsLoading(false);
          navigate('/404', { replace: true });
          return;
        }
      }

      setIsLoading(false);
    };

    loadData();
  }, [searchTerm, currentPage, isPageValid, navigate]);

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set('page', pageNumber.toString());
    navigate(`${window.location.pathname}?${newParams.toString()}`);
  };

  const handleRowClick = (id: string | number) => {
    const currentParams = searchParams.toString();
    const queryString = currentParams ? `?${currentParams}` : '';
    navigate(`pokemon/${id}${queryString}`);
  };

  return (
    <div className={styles.resultsArea}>
      <div className={styles.tableHeader}>
        <div className={styles.cellName}>NAME</div>
        <div className={styles.cellImage}>ICON</div>
        <div className={styles.cellData}>POKEDEX DATA</div>
      </div>

      <div className={styles.tableBody}>
        {isLoading && <div className={styles.scanning}>SYSTEM SCANNING...</div>}

        {errorMessage && !isLoading && (
          <div className={styles.errorBanner}>
            <h3>⚠️ DATABASE ERROR</h3>
            <p>{errorMessage}</p>
          </div>
        )}

        {!isLoading && !errorMessage && pokemons.length === 0 && (
          <div className={styles.errorBanner}>
            <h3>🔍 NO DATA FOUND</h3>
          </div>
        )}

        {!isLoading &&
          !errorMessage &&
          pokemons.length > 0 &&
          pokemons.map((pokemon) => (
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
