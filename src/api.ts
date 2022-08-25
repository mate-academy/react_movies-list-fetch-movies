import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=67322304';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .then(responce => {
      if (responce.Response === 'False') {
        throw new Error('Invalid responce from server');
      }

      return responce;
    });
}
