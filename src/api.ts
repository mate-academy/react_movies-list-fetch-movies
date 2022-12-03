import { MovieData } from './types/MovieData';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=fe815c7';

export function getMovie(query: string): Promise<MovieData> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json());
}
