import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchDetailedPokemons } from '../../services/api';
import styles from './PokemonDetails.module.css';
import { PokemonListItem } from '../../types/pokemonTypes';

export default function PokemonDetails() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page');

  const isPageValid = pageParam === null || /^\d+$/.test(pageParam);

  const [pokemon, setPokemon] = useState<PokemonListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isPageValid) {
      navigate('/404', { replace: true });
      return;
    }

    if (!detailsId) {
      setPokemon(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    const getDetails = async () => {
      setIsLoading(true);
      setError(null);

      const result = await fetchDetailedPokemons(detailsId);

      if (result && 'isError' in result) {
        setIsLoading(false);
        navigate('/404', { replace: true });
        return;
      } else if (result && 'pokemons' in result && result.pokemons.length > 0) {
        setPokemon(result.pokemons[0]);
      } else {
        setIsLoading(false);
        navigate('/404', { replace: true });
        return;
      }

      setIsLoading(false);
    };

    getDetails();
  }, [detailsId, isPageValid, navigate]);

  const handleClose = () => {
    const currentParams = searchParams.toString();
    const queryString = currentParams ? `?${currentParams}` : '';
    navigate(`/${queryString}`);
  };

  if (!detailsId) {
    return null;
  }

  return (
    <div className={styles.detailsPanel}>
      <button
        onClick={handleClose}
        className={styles.closeBtn}
        title="Close Details"
      >
        ✖
      </button>

      {isLoading && (
        <div className={styles.loadingText}>LOADING DETAILS...</div>
      )}

      {!isLoading && !error && pokemon && (
        <div className={styles.content}>
          <h2 className={styles.pokemonTitle}>{pokemon.name}</h2>
          <div className={styles.imageContainer}>
            {pokemon.image ? (
              <img
                src={pokemon.image}
                alt={pokemon.name}
                className={styles.sprite}
              />
            ) : (
              <div className={styles.noImage}>NO PHOTO</div>
            )}
          </div>
          <div className={styles.statsBlock}>
            <p className={styles.desc}>{pokemon.description}</p>
          </div>
        </div>
      )}
    </div>
  );
}
