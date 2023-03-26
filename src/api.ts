import { GetMovie } from './types/events';

const API_KEY = '132d4730';
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export const getMovie: GetMovie = query => fetch(`${API_URL}&t=${query}`)
  .then(response => {
    if (!response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw `${response.status} - ${response.statusText}`;
    }

    if (!response.headers.get('content-type')?.includes('application/json')) {
      // eslint-disable-next-line @typescript-eslint/no-throw-literal
      throw 'Content type is not supported';
    }

    return response.json();
  });
