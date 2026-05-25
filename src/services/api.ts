import { BASE_URL, ITEMS_PER_PAGE } from '../constants/pokemonConstants';
import {
  ApiError,
  PaginatedPokemonResponse,
  PokemonListItem,
} from '../types/pokemonTypes';

interface IPokeType {
  type: { name: string };
}

interface IPokeAbility {
  ability: { name: string };
}

interface IPokeResponse {
  id: number;
  name: string;
  weight: number;
  height: number;
  sprites: {
    front_default: string | null;
  };
  types: IPokeType[];
  abilities: IPokeAbility[];
}

interface IListResponse {
  count: number;
  results: { name: string; url: string }[];
}

export const fetchDetailedPokemons = async (
  searchTerm?: string,
  page: number = 1,
  limit: number = ITEMS_PER_PAGE
): Promise<PaginatedPokemonResponse | ApiError> => {
  const isSpecificSearch = !!(searchTerm && searchTerm.trim());

  let url = '';
  if (isSpecificSearch) {
    url = `${BASE_URL}/${searchTerm.toLowerCase().trim()}`;
  } else {
    const offset = (page - 1) * limit;
    url = `${BASE_URL}?limit=${limit}&offset=${offset}`;
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return {
        isError: true,
        message:
          response.status === 404
            ? 'Pokemon not found in database'
            : response.statusText || 'Bad Request',
        status: response.status,
      };
    }

    const data = (await response.json()) as IPokeResponse | IListResponse;

    let items: { name: string; url: string }[];
    let totalCount = 0;

    if (isSpecificSearch && 'id' in data) {
      items = [{ name: data.name, url: `${BASE_URL}/${data.id}/` }];
      totalCount = 1;
    } else if ('results' in data) {
      items = data.results;
      totalCount = data.count;
    } else {
      return { pokemons: [], count: 0 };
    }

    const detailedData = await Promise.all(
      items.map(async (item): Promise<PokemonListItem | null> => {
        try {
          const res = await fetch(item.url);
          if (!res.ok) return null;

          const details = (await res.json()) as IPokeResponse;

          const weightKg = details.weight / 10;
          const heightM = details.height / 10;

          const types = details.types
            .map((t: IPokeType) => t.type.name)
            .join(', ');
          const attacks = details.abilities
            .map((a: IPokeAbility) => a.ability.name)
            .join(', ');
          const description = `Type: ${types} | Weight: ${weightKg}kg | Height: ${heightM}m | Attacks: ${attacks}`;
          return {
            name: details.name.toUpperCase(),
            description: description,
            image: details.sprites.front_default || '',
          };
        } catch {
          return null;
        }
      })
    );

    const filteredPokemons = detailedData.filter(
      (item): item is PokemonListItem => item !== null
    );

    return {
      pokemons: filteredPokemons,
      count: totalCount,
    };
  } catch (error) {
    return {
      isError: true,
      message:
        error instanceof Error ? error.message : 'Network Connection Error',
    };
  }
};
