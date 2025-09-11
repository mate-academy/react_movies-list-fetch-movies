import { MovieData } from './types/MovieData';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=80a5b71d';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json())
    .catch(() => ({
      Response: 'False',
      Error: 'unexpected error',
    }));
}
