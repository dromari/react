import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { server } from './node';
import ResultsContainer from '../components/ResultsContainer/ResultsContainer';
import * as api from '../services/api';
import { BASE_URL } from '../constants/pokemonConstants';
import { PaginatedPokemonResponse } from '../types/pokemonTypes';
import ThemeProvider from '../context/ThemeProvider';

describe('ResultsContainer Component', () => {
  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  const createTestQueryClient = () =>
    new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    });

  it('shows loading state initially', () => {
    const testQueryClient = createTestQueryClient();

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter>
          <ResultsContainer searchTerm="" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(screen.getByText(/SYSTEM SCANNING.../i)).toBeInTheDocument();
  });

  it('handles page changes and calculation correctly', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [
        { name: 'BULBASAUR', description: 'Grass', image: 'img' },
        { name: 'IVYSAUR', description: 'Grass 2', image: '' },
      ],
      count: 15,
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/?page=2']}>
          <Routes>
            <Route path="*" element={<ResultsContainer searchTerm="" />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const prevButton = await screen.findByRole('button', { name: /◀ PREV/i });
    expect(prevButton).toBeInTheDocument();
    fireEvent.click(prevButton);

    const nextButton = await screen.findByRole('button', { name: /NEXT ▶/i });
    expect(nextButton).toBeInTheDocument();
    fireEvent.click(nextButton);
  });

  it('navigates to details view when a row is clicked', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [{ name: 'BULBASAUR', description: 'Grass', image: 'img' }],
      count: 1,
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Routes>
            <Route path="/" element={<ResultsContainer searchTerm="" />} />
            <Route path="/pokemon/:id" element={<div>Pokemon Page Mock</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const row = await screen.findByText(/BULBASAUR/i);
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByText('Pokemon Page Mock')).toBeInTheDocument();
    });
  });

  it('redirects to 404 on alphabetical parameters', async () => {
    const testQueryClient = createTestQueryClient();
    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/?page=abc']}>
          <Routes>
            <Route path="/" element={<ResultsContainer searchTerm="" />} />
            <Route path="/404" element={<div>404 Page Mock</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText('404 Page Mock')).toBeInTheDocument();
  });

  it('redirects to 404 when page is out of bounds', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [],
      count: 5,
    });
    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/?page=99']}>
          <Routes>
            <Route path="/" element={<ResultsContainer searchTerm="" />} />
            <Route path="/404" element={<div>404 Page Mock</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText('404 Page Mock')).toBeInTheDocument();
  });

  it('shows DATABASE ERROR for 500 status code', async () => {
    const testQueryClient = createTestQueryClient();
    server.use(
      http.get(`${BASE_URL}*`, () => new HttpResponse(null, { status: 500 }))
    );
    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <ResultsContainer searchTerm="error" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText(/⚠️ DATABASE ERROR/i)).toBeInTheDocument();
  });

  it('handles empty results array', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [],
      count: 0,
    });
    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter>
          <ResultsContainer searchTerm="non-existent" />
        </MemoryRouter>
      </QueryClientProvider>
    );
    expect(await screen.findByText(/🔍 NO DATA FOUND/i)).toBeInTheDocument();
  });

  it('displays error banner inside container when api returns a standard error', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      isError: true,
      message: 'Failed to fetch items from database',
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/?page=1']}>
          <Routes>
            <Route
              path="/"
              element={<ResultsContainer searchTerm="pikachu" />}
            />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const errorBanner = await screen.findByText(
      'Failed to fetch items from database'
    );
    expect(errorBanner).toBeInTheDocument();
  });

  it('handles row click when URL has no query parameters', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [{ name: 'BULBASAUR', description: 'Grass', image: 'img' }],
      count: 1,
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter initialEntries={['/']}>
          <Routes>
            <Route path="/" element={<ResultsContainer searchTerm="" />} />
            <Route path="/pokemon/:id" element={<div>Details View Mock</div>} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    const row = await screen.findByText(/BULBASAUR/i);
    fireEvent.click(row);

    await waitFor(() => {
      expect(screen.getByText('Details View Mock')).toBeInTheDocument();
    });
  });

  it('handles fallback when API response does not contain pokemons field', async () => {
    const testQueryClient = createTestQueryClient();
    const unexpectedResponse = {} as unknown as PaginatedPokemonResponse;

    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue(
      unexpectedResponse
    );

    render(
      <QueryClientProvider client={testQueryClient}>
        <MemoryRouter>
          <ResultsContainer searchTerm="test" />
        </MemoryRouter>
      </QueryClientProvider>
    );

    const noDataMsg = await screen.findByText(/🔍 NO DATA FOUND/i);
    expect(noDataMsg).toBeInTheDocument();
  });

  it('toggles pokemon selection and stops propagation on checkbox click', async () => {
    const testQueryClient = createTestQueryClient();
    vi.spyOn(api, 'fetchDetailedPokemons').mockResolvedValue({
      pokemons: [{ name: 'BULBASAUR', description: 'Grass', image: 'img' }],
      count: 1,
    });

    render(
      <QueryClientProvider client={testQueryClient}>
        <ThemeProvider>
          <MemoryRouter initialEntries={['/?page=1']}>
            <Routes>
              <Route path="/" element={<ResultsContainer searchTerm="" />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </QueryClientProvider>
    );

    const pokemonRow = await screen.findByText(/BULBASAUR/i);
    expect(pokemonRow).toBeInTheDocument();

    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox).toBeInTheDocument();

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(true);

    fireEvent.click(checkbox);
    expect(checkbox.checked).toBe(false);
  });
});
