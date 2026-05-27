import { useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import styles from './PokemonDetails.module.css';
import { usePokemonDetail } from '../../hooks/usePokemonQueries';

export default function PokemonDetails() {
  const { detailsId } = useParams<{ detailsId: string }>();
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page');
  const isPageValid = pageParam === null || /^\d+$/.test(pageParam);

  const { data, isLoading, isError } = usePokemonDetail(detailsId);

  const pokemon =
    data && 'pokemons' in data && data.pokemons.length > 0
      ? data.pokemons[0]
      : null;

  useEffect(() => {
    if (!isPageValid) {
      navigate('/404', { replace: true });
      return;
    }

    if (isError || (data && !pokemon)) {
      navigate('/404', { replace: true });
    }
  }, [isError, data, pokemon, isPageValid, navigate]);

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

      {!isLoading && !isError && pokemon && (
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
