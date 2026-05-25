import { describe, it, expect, beforeEach } from 'vitest';
import { usePokemonStore } from '../store/usePokemonStore';
import { BASE_URL } from '../constants/pokemonConstants';

describe('usePokemonStore Coverage Tests', () => {
  beforeEach(() => {
    usePokemonStore.getState().unselectAll();
  });

  it('should initialize with an empty selectedPokemons array', () => {
    const state = usePokemonStore.getState();
    expect(state.selectedPokemons).toEqual([]);
  });

  it('should add a pokemon and generate the correct detailsUrl if not selected', () => {
    const mockPokemon = {
      name: 'PIKACHU',
      description: 'Electric type',
      image: 'pikachu.png',
    };

    usePokemonStore.getState().togglePokemon(mockPokemon);

    const state = usePokemonStore.getState();
    expect(state.selectedPokemons).toHaveLength(1);
    expect(state.selectedPokemons[0]).toEqual({
      ...mockPokemon,
      detailsUrl: `${BASE_URL}/pikachu`,
    });
  });

  it('should remove a pokemon from selectedPokemons if it is already selected', () => {
    const mockPokemon = {
      name: 'CHARIZARD',
      description: 'Fire type',
      image: 'charizard.png',
    };

    usePokemonStore.getState().togglePokemon(mockPokemon);
    expect(usePokemonStore.getState().selectedPokemons).toHaveLength(1);

    usePokemonStore.getState().togglePokemon(mockPokemon);
    expect(usePokemonStore.getState().selectedPokemons).toHaveLength(0);
  });

  it('should clear all selected pokemons when unselectAll is called', () => {
    const pokemon1 = { name: 'BULBASAUR', description: 'Grass', image: '' };
    const pokemon2 = { name: 'SQUIRTLE', description: 'Water', image: '' };

    usePokemonStore.getState().togglePokemon(pokemon1);
    usePokemonStore.getState().togglePokemon(pokemon2);
    expect(usePokemonStore.getState().selectedPokemons).toHaveLength(2);

    usePokemonStore.getState().unselectAll();
    expect(usePokemonStore.getState().selectedPokemons).toHaveLength(0);
  });
});
