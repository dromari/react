import { http, HttpResponse } from 'msw';
import { BASE_URL } from '../constants/pokemonConstants';

export const handlers = [
  http.get(BASE_URL, () => {
    return HttpResponse.json({ status: 'ok' });
  }),

  http.get(BASE_URL, () => {
    return HttpResponse.json({
      results: [{ name: 'bulbasaur', url: `${BASE_URL}/1/` }],
    });
  }),

  http.get(`${BASE_URL}/*`, ({ params }) => {
    const id = params['*'];

    return HttpResponse.json({
      id: 1,
      name: typeof id === 'string' ? id : 'bulbasaur',
      weight: 69,
      height: 7,
      sprites: { front_default: 'bulba_img' },
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
    });
  }),
];
