import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=f39e7bf2';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json());
}
