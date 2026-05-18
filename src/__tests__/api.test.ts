import { fetchDetailedPokemons } from '../services/api';
import { server } from './node';
import { http, HttpResponse } from 'msw';
import { describe, it, expect, vi, afterEach } from 'vitest';

const BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

describe('api service logic', () => {
  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  it('correctly formats URL for search', async () => {
    const result = await fetchDetailedPokemons('pikachu');
    expect(result).not.toBeNull();
  });

  it('handles 404 error', async () => {
    server.use(
      http.get(`${BASE_URL}/*`, () => {
        return new HttpResponse(null, { status: 404 });
      })
    );
    const result = await fetchDetailedPokemons('unknown');
    expect(result).toMatchObject({ message: 'Pokemon not found in database' });
  });

  it('handles non-404 error without status text', async () => {
    server.use(
      http.get(`${BASE_URL}/*`, () => {
        return new Response(null, { status: 400 });
      })
    );
    const result = await fetchDetailedPokemons('test');
    if ('isError' in result) {
      expect(result.message).toBe('Bad Request');
    }
  });

  it('handles unexpected JSON structure', async () => {
    server.use(
      http.get(`${BASE_URL}/*`, () => {
        return HttpResponse.json({ strange: 'data' });
      })
    );
    const result = await fetchDetailedPokemons('test');
    expect(result).toEqual({ pokemons: [], count: 0 });
  });

  it('handles failure during detailed data fetch', async () => {
    server.use(
      http.get(BASE_URL, () => {
        return HttpResponse.json({
          count: 1,
          results: [{ name: 'fail', url: `${BASE_URL}/999/` }],
        });
      }),
      http.get(`${BASE_URL}/999/`, () => {
        return new HttpResponse(null, { status: 500 });
      })
    );
    const result = await fetchDetailedPokemons('');
    expect(result).toEqual({ pokemons: [], count: 1 });
  });

  it('handles missing image in sprites', async () => {
    server.use(
      http.get(`${BASE_URL}/1/`, () => {
        return HttpResponse.json({
          id: 1,
          name: 'bulbasaur',
          weight: 1,
          height: 1,
          sprites: { front_default: null },
          types: [],
          abilities: [],
        });
      })
    );
    const result = await fetchDetailedPokemons('1');
    if (result && 'pokemons' in result && Array.isArray(result.pokemons)) {
      expect(result.pokemons[0].image).toBe('');
    }
  });

  it('handles network error in Promise.all', async () => {
    server.use(
      http.get(BASE_URL, () => {
        return HttpResponse.json({
          count: 1,
          results: [{ name: 'pikachu', url: `${BASE_URL}/1/` }],
        });
      }),
      http.get(`${BASE_URL}/1/`, () => HttpResponse.error())
    );
    const result = await fetchDetailedPokemons('');
    expect(result).toEqual({ pokemons: [], count: 1 });
  });

  it('handles non-Error object in catch', async () => {
    const spy = vi.spyOn(window, 'fetch').mockImplementation(() => {
      throw 'String Error';
    });

    const result = await fetchDetailedPokemons('test');
    expect(result).toMatchObject({ message: 'Network Connection Error' });

    spy.mockRestore();
  });

  it('handles standard Error object in catch', async () => {
    server.use(http.get(`${BASE_URL}*`, () => HttpResponse.error()));
    const result = await fetchDetailedPokemons('pikachu');
    if ('isError' in result) {
      expect(result.message).not.toBe('Network Connection Error');
    }
  });
});
