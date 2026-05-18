import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import PokemonDetails from '../components/PokemonDetails/PokemonDetails';
import * as api from '../services/api';

describe('PokemonDetails Component', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  const renderWithRouter = (detailsId: string, pageQuery = '') => {
    return render(
      <MemoryRouter initialEntries={[`/pokemon/${detailsId}${pageQuery}`]}>
        <Routes>
          <Route path="/pokemon/:detailsId" element={<PokemonDetails />} />
          <Route path="/404" element={<div>404 Page Mock</div>} />
        </Routes>
      </MemoryRouter>
    );
  };

  it('renders loading text initially when details are fetching', () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockReturnValue(
      new Promise(() => {})
    );
    renderWithRouter('pikachu');
    expect(screen.getByText(/LOADING DETAILS.../i)).toBeInTheDocument();
  });

  it('displays pokemon details after a successful api response', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [
        {
          name: 'PIKACHU',
          description: 'Type: electric',
          image: 'pikachu_url',
        },
      ],
      count: 1,
    });

    renderWithRouter('pikachu', '?page=1');

    await waitFor(() => {
      expect(screen.getByText('PIKACHU')).toBeInTheDocument();
    });
    expect(screen.getByText(/Type: electric/i)).toBeInTheDocument();
  });

  it('redirects to 404 when isPageValid is false', async () => {
    render(
      <MemoryRouter initialEntries={['/pokemon/pikachu?page=abc']}>
        <Routes>
          <Route path="/pokemon/:detailsId" element={<PokemonDetails />} />
          <Route path="/404" element={<div>404 Page Mock</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(await screen.findByText('404 Page Mock')).toBeInTheDocument();
  });

  it('returns null and cleans state when detailsId is not provided', () => {
    const { container } = render(
      <MemoryRouter initialEntries={['/pokemon/']}>
        <Routes>
          <Route path="/pokemon/:detailsId?" element={<PokemonDetails />} />
        </Routes>
      </MemoryRouter>
    );
    expect(container.firstChild).toBeNull();
  });

  it('calls handleClose and navigates back when close button is clicked', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [{ name: 'PIKACHU', description: 'Electric', image: 'url' }],
      count: 1,
    });

    render(
      <MemoryRouter initialEntries={['/pokemon/pikachu?page=2']}>
        <Routes>
          <Route path="/pokemon/:detailsId" element={<PokemonDetails />} />
          <Route path="/" element={<div>Main Application Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const closeButton = await screen.findByTitle(/Close Details/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText('Main Application Page')).toBeInTheDocument();
    });
  });
  it('redirects to 404 when api returns an error', async () => {
    const apiError: api.ApiError = { isError: true, message: 'Not Found' };
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue(apiError);

    renderWithRouter('invalid-pokemon');

    await waitFor(() => {
      expect(screen.getByText('404 Page Mock')).toBeInTheDocument();
    });
  });

  it('redirects to 404 if response has no pokemons array or is empty', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [],
      count: 0,
    });

    renderWithRouter('empty');

    await waitFor(() => {
      expect(screen.getByText('404 Page Mock')).toBeInTheDocument();
    });
  });

  it('displays NO PHOTO placeholder when pokemon image is missing', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [{ name: 'UNOWN', description: 'Mysterious', image: '' }],
      count: 1,
    });

    renderWithRouter('unown');

    await waitFor(() => {
      expect(screen.getByText('UNOWN')).toBeInTheDocument();
    });
    expect(screen.getByText(/NO PHOTO/i)).toBeInTheDocument();
  });

  it('handles close button click when URL has no search parameters', async () => {
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [{ name: 'PIKACHU', description: 'Electric', image: 'url' }],
      count: 1,
    });

    render(
      <MemoryRouter initialEntries={['/pokemon/pikachu']}>
        {' '}
        <Routes>
          <Route path="/pokemon/:detailsId" element={<PokemonDetails />} />
          <Route path="/" element={<div>Main App Clean</div>} />
        </Routes>
      </MemoryRouter>
    );

    const closeButton = await screen.findByTitle(/Close Details/i);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(screen.getByText('Main App Clean')).toBeInTheDocument();
    });
  });
});
