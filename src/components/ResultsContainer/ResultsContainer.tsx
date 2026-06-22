import Image from 'next/image';
import { Link } from '@/i18n/routing';
import styles from './Results.module.css';
import { PokemonListItem } from '../../types/pokemonTypes';
import { ITEMS_PER_PAGE } from '../../constants/pokemonConstants';
import PokemonCheckbox from './PokemonCheckbox';

interface ResultsContainerProps {
  pokemons: PokemonListItem[];
  totalCount: number;
  currentPage: number;
  currentQuery: string;
  translations: {
    select: string;
    name: string;
    icon: string;
    data: string;
    noData: string;
    prev: string;
    next: string;
    pageInfo: string;
  };
  isError?: boolean;
  errorMessage?: string;
}

export default function ResultsContainer({
  pokemons,
  totalCount,
  currentPage,
  currentQuery,
  translations,
  isError = false,
  errorMessage = '',
}: ResultsContainerProps) {
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);
  const queryParam = currentQuery
    ? `&query=${encodeURIComponent(currentQuery)}`
    : '';

  const formatPageInfo = (template: string, current: number, total: number) => {
    return template
      .replace('{current}', current.toString())
      .replace('{total}', total.toString());
  };

  return (
    <div className={styles.resultsArea}>
      <div className={styles.tableHeader}>
        <div className={styles.cellCheckbox}>{translations.select}</div>
        <div className={styles.cellName}>{translations.name}</div>
        <div className={styles.cellImage}>{translations.icon}</div>
        <div className={styles.cellData}>{translations.data}</div>
      </div>

      <div className={styles.tableBody}>
        {isError && (
          <div className={styles.errorCentered}>
            <div className={styles.errorIcon}>⚠</div>
            <h3>{errorMessage}</h3>
          </div>
        )}

        {!isError && pokemons.length === 0 && (
          <div className={styles.errorBanner}>
            <h3>{translations.noData}</h3>
          </div>
        )}

        {!isError &&
          pokemons.length > 0 &&
          pokemons.map((pokemon) => {
            const pokemonId = pokemon.name.toLowerCase();

            return (
              <Link
                key={pokemon.name}
                href={`/?page=${currentPage}${queryParam}&id=${pokemonId}`}
                className={styles.tableRow}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className={styles.cellCheckbox}>
                  <PokemonCheckbox pokemon={pokemon} />
                </div>

                <div className={styles.cellName}>
                  <strong>{pokemon.name}</strong>
                </div>
                <div className={styles.cellImage}>
                  {pokemon.image ? (
                    <Image
                      src={pokemon.image}
                      alt={pokemon.name}
                      width={48}
                      height={48}
                      className={styles.pokemonSprite}
                      unoptimized={true}
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
              </Link>
            );
          })}
      </div>

      {!isError && totalPages > 1 && (
        <div className={styles.paginationBlock}>
          {currentPage > 1 ? (
            <Link
              href={`/?page=${currentPage - 1}${queryParam}`}
              className={styles.pageButton}
            >
              {translations.prev}
            </Link>
          ) : (
            <span className={`${styles.pageButton} ${styles.disabled}`}>
              {translations.prev}
            </span>
          )}

          <span className={styles.pageInfo}>
            {formatPageInfo(translations.pageInfo, currentPage, totalPages)}
          </span>

          {currentPage < totalPages ? (
            <Link
              href={`/?page=${currentPage + 1}${queryParam}`}
              className={styles.pageButton}
            >
              {translations.next}
            </Link>
          ) : (
            <span className={`${styles.pageButton} ${styles.disabled}`}>
              {translations.next}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
