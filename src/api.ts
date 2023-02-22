import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const accessKey = '92182745';
const API_URL = `https://www.omdbapi.com/?apikey=${accessKey}`;

export function getMovie(query: string): Promise<MovieData | ResponseError> {
  return fetch(`${API_URL}&t=${query}`)
    .then(res => res.json());
}
