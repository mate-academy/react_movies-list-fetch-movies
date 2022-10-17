import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const key = '624a3b14';
const API_URL = `https://www.omdbapi.com/?apikey=${key}`;

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  try {
    const res = await fetch(`${API_URL}&t=${query}`);

    return await res.json();
  } catch {
    return ({
      Response: 'False',
      Error: 'unexpected error',
    });
  }
}
