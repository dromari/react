import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchDetailedPokemons, PokemonListItem } from '../../services/api';
import styles from './PokemonDetails.module.css';

export default function PokemonDetails() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const navigate = useNavigate();

  const [pokemon, setPokemon] = useState<PokemonListItem | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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
        setError(result.message);
        setPokemon(null);
      } else if (Array.isArray(result) && result.length > 0) {
        setPokemon(result[0]);
      } else {
        setError('No details found for this Pokemon');
        setPokemon(null);
      }

      setIsLoading(false);
    };

    getDetails();
  }, [detailsId]);

  const handleClose = () => {
    navigate('/');
  };

  return (
    <div className={styles.detailsPanel}>
      {detailsId && (
        <button
          onClick={handleClose}
          className={styles.closeBtn}
          title="Close Details"
        >
          ✖
        </button>
      )}

      {isLoading && (
        <div className={styles.loadingText}>LOADING DETAILS...</div>
      )}

      {error && !isLoading && (
        <div className={styles.errorText}>
          <h4>⚠️ DETAILS ERROR</h4>
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className={styles.content}>
          <h2 className={styles.pokemonTitle}>
            {pokemon ? pokemon.name : 'NAME'}
          </h2>

          <div className={styles.imageContainer}>
            {pokemon ? (
              pokemon.image ? (
                <img
                  src={pokemon.image}
                  alt={pokemon.name}
                  className={styles.sprite}
                />
              ) : (
                <div className={styles.noImage}>NO PHOTO</div>
              )
            ) : (
              <div className={styles.noImage}>?</div>
            )}
          </div>

          <div className={styles.statsBlock}>
            <p className={styles.desc}>
              {pokemon ? pokemon.description : 'Description'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
