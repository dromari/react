import { create } from 'zustand';
import { PokemonListItem, SelectedPokemon } from '../types/pokemonTypes';
import { BASE_URL } from '../constants/pokemonConstants';

interface PokemonState {
  selectedPokemons: SelectedPokemon[];
  togglePokemon: (pokemon: PokemonListItem) => void;
  unselectAll: () => void;
}

export const usePokemonStore = create<PokemonState>((set) => ({
  selectedPokemons: [],

  togglePokemon: (pokemon) =>
    set((state) => {
      const isSelected = state.selectedPokemons.some(
        (p) => p.name === pokemon.name
      );

      if (isSelected) {
        return {
          selectedPokemons: state.selectedPokemons.filter(
            (p) => p.name !== pokemon.name
          ),
        };
      } else {
        const detailsUrl = `${BASE_URL}/${pokemon.name.toLowerCase()}`;
        const newPokemon: SelectedPokemon = { ...pokemon, detailsUrl };
        return { selectedPokemons: [...state.selectedPokemons, newPokemon] };
      }
    }),

  unselectAll: () => set({ selectedPokemons: [] }),
}));
