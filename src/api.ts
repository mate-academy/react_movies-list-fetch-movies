import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=8bd12c59';

// eslint-disable-next-line max-len
export async function getMovie(query: string): Promise<MovieData | ResponseError> {
  const response = await fetch(`${API_URL}&t=${query}`);

  return response.json();
}
