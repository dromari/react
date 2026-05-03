export interface PokemonListItem {
  name: string;
  description: string;
  image: string;
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
    front_default: string;
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
): Promise<PokemonListItem[]> => {
  const url =
    searchTerm && searchTerm.trim() !== ''
      ? `${BASE_URL}/${searchTerm.toLowerCase().trim()}`
      : `${BASE_URL}?limit=10`;

  const response = await fetch(url);
  if (!response.ok) throw new Error('Pokemon not found');
  const data = await response.json();

  const items = searchTerm
    ? [{ name: data.name, url: `${BASE_URL}/${data.id}/` }]
    : (data as IListResponse).results;

  return await Promise.all(
    items.map(async (item): Promise<PokemonListItem> => {
      const res = await fetch(item.url);
      const details: IPokeResponse = await res.json();

      const weightKg = details.weight / 10;
      const heightM = details.height / 10;
      const types = details.types.map((t) => t.type.name).join(', ');
      const attacks = details.abilities.map((a) => a.ability.name).join(', ');

      const description = `Type: ${types} | Weight: ${weightKg}kg | Height: ${heightM}m | Attacks: ${attacks}`;

      return {
        name: details.name.toUpperCase(),
        description: description,
        image: details.sprites.front_default || '',
      };
    })
  );
};
