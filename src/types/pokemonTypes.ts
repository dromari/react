export interface PokemonListItem {
  name: string;
  description: string;
  image: string;
}

export interface PaginatedPokemonResponse {
  pokemons: PokemonListItem[];
  count: number;
}

export interface ApiError {
  isError: true;
  message: string;
  status?: number;
}

export interface SelectedPokemon extends PokemonListItem {
  detailsUrl: string;
}

export interface ResultsContainerProps {
  searchTerm: string;
}

export interface SearchBarProps {
  onSearch: (term: string) => void;
  initialValue: string;
}
