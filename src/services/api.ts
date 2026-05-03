export interface PokemonListItem {
  name: string;
  description: string;
  image: string;
}

export interface ApiError {
  isError: true;
  message: string;
  status?: number;
}

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
  results: { name: string; url: string }[];
}

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

export const fetchDetailedPokemons = async (
  searchTerm?: string
): Promise<PokemonListItem[] | ApiError> => {
  const isSpecificSearch = !!(searchTerm && searchTerm.trim());
  const url = isSpecificSearch
    ? `${BASE_URL}/${searchTerm.toLowerCase().trim()}`
    : `${BASE_URL}?limit=20`;

  try {
    const response = await fetch(url);

    if (response.status === 404) return [];

    if (!response.ok) {
      return {
        isError: true,
        message: response.statusText || 'Bad Request',
        status: response.status,
      };
    }

    const data = (await response.json()) as IPokeResponse | IListResponse;

    let items: { name: string; url: string }[];

    if (isSpecificSearch && 'id' in data) {
      items = [{ name: data.name, url: `${BASE_URL}/${data.id}/` }];
    } else if ('results' in data) {
      items = data.results;
    } else {
      return [];
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

    return detailedData.filter(
      (item): item is PokemonListItem => item !== null
    );
  } catch (error) {
    return {
      isError: true,
      message:
        error instanceof Error ? error.message : 'Network Connection Error',
    };
  }
};
