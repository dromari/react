export interface PokemonListItem {
  name: string;
  description: string;
  image: string;
  detailsUrl?: string;
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
  pokemons: PokemonListItem[];
  totalCount: number;
  currentPage: number;
}

export interface SearchBarProps {
  initialQuery: string;
}
