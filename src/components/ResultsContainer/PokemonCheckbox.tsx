'use client';

import { usePokemonStore } from '../../store/usePokemonStore';
import { PokemonListItem } from '../../types/pokemonTypes';
import styles from './Results.module.css';

interface PokemonCheckboxProps {
  pokemon: PokemonListItem;
}

export default function PokemonCheckbox({ pokemon }: PokemonCheckboxProps) {
  const { selectedPokemons, togglePokemon } = usePokemonStore();
  const isSelected = selectedPokemons.some((p) => p.name === pokemon.name);

  return (
    <input
      className={styles.checkbox}
      type="checkbox"
      checked={isSelected}
      onChange={() => togglePokemon(pokemon)}
      onClick={(e) => {
        e.stopPropagation();
      }}
      style={{ cursor: 'pointer' }}
    />
  );
}
