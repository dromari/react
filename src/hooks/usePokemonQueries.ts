import { useQuery } from '@tanstack/react-query';
import { fetchDetailedPokemons } from '../services/api';
import { PaginatedPokemonResponse } from '../types/pokemonTypes';

export function usePokemons(
  searchTerm: string,
  currentPage: number,
  limit: number
) {
  return useQuery<PaginatedPokemonResponse, Error>({
    queryKey: ['pokemons', searchTerm, currentPage, limit],
    queryFn: async () => {
      const result = await fetchDetailedPokemons(
        searchTerm,
        currentPage,
        limit
      );
      if (result && 'isError' in result) {
        throw new Error(result.message);
      }
      return result as PaginatedPokemonResponse;
    },
    retry: false,
  });
}

export function usePokemonDetail(detailsId: string | undefined) {
  return useQuery<PaginatedPokemonResponse, Error>({
    queryKey: ['pokemonDetail', detailsId],
    queryFn: async () => {
      const result = await fetchDetailedPokemons(detailsId);
      if (result && 'isError' in result) {
        throw new Error(result.message);
      }
      return result as PaginatedPokemonResponse;
    },
    enabled: !!detailsId,
    retry: false,
  });
}
