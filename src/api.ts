import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=93e4a9dd';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .then(res => {
      if (res.Response === 'False') {
        throw new Error('error in fetching data');
      }

      return res;
    });
}
