'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './Results.module.css';
import { PokemonListItem } from '../../types/pokemonTypes';
import { ITEMS_PER_PAGE } from '../../constants/pokemonConstants';
import { usePokemonStore } from '../../store/usePokemonStore';

interface ResultsContainerProps {
  pokemons: PokemonListItem[];
  totalCount: number;
  currentPage: number;
}

export default function ResultsContainer({
  pokemons,
  totalCount,
  currentPage,
}: ResultsContainerProps) {
  const { selectedPokemons, togglePokemon } = usePokemonStore();
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const handlePageChange = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', pageNumber.toString());
    router.push(`/?${params.toString()}`);
  };

  const handleRowClick = (name: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('id', name.toLowerCase());
    router.push(`/?${params.toString()}`);
  };

  return (
    <div className={styles.resultsArea}>
      <div className={styles.tableHeader}>
        <div className={styles.cellCheckbox}>SELECT</div>
        <div className={styles.cellName}>NAME</div>
        <div className={styles.cellImage}>ICON</div>
        <div className={styles.cellData}>POKEDEX DATA</div>
      </div>

      <div className={styles.tableBody}>
        {pokemons.length === 0 && (
          <div className={styles.errorBanner}>
            <h3>🔍 NO DATA FOUND</h3>
          </div>
        )}

        {pokemons.length > 0 &&
          pokemons.map((pokemon) => {
            const isSelected = selectedPokemons.some(
              (p) => p.name === pokemon.name
            );

            return (
              <div
                key={pokemon.name}
                className={styles.tableRow}
                onClick={() => handleRowClick(pokemon.name)}
                style={{ cursor: 'pointer' }}
              >
                <div
                  className={styles.cellCheckbox}
                  onClick={(e) => e.stopPropagation()}
                >
                  <input
                    className={styles.checkbox}
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => togglePokemon(pokemon)}
                    style={{ cursor: 'pointer' }}
                  />
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
              </div>
            );
          })}
      </div>

      {totalPages > 1 && (
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
