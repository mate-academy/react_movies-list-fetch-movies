import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=b8df89c';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => {
      return res.ok ? res.json() : `${res.status}: ${res.statusText}`;
    });
}
