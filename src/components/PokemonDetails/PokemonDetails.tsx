'use client';

import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './PokemonDetails.module.css';
import { PokemonListItem } from '../../types/pokemonTypes';

interface PokemonDetailsProps {
  pokemon: PokemonListItem | null;
  isLoading?: boolean;
}

export default function PokemonDetails({
  pokemon,
  isLoading,
}: PokemonDetailsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleClose = () => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('id');
    router.push(`/?${params.toString()}`);
  };

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

      {!isLoading && !pokemon && (
        <div className={styles.loadingText}>POKEMON NOT FOUND</div>
      )}

      {!isLoading && pokemon && (
        <div className={styles.content}>
          <h2 className={styles.pokemonTitle}>{pokemon.name}</h2>
          <div className={styles.imageContainer}>
            {pokemon.image ? (
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={150}
                height={150}
                className={styles.sprite}
                unoptimized={true}
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
