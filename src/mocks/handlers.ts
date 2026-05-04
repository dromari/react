import { http, HttpResponse } from 'msw';

export const handlers = [
  http.get('https://pokeapi.co*', () => {
    return HttpResponse.json({
      results: [{ name: 'bulbasaur', url: 'https://pokeapi.co/1/' }],
    });
  }),

  http.get('https://pokeapi.co/1/', () => {
    return HttpResponse.json({
      id: 1,
      name: 'bulbasaur',
      sprites: { front_default: 'img_url' },
      weight: 69,
      height: 7,
      types: [{ type: { name: 'grass' } }],
      abilities: [{ ability: { name: 'overgrow' } }],
    });
  }),
];
