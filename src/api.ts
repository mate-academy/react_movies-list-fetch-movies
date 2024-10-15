import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=75a68c08';

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  try {
    const res = await fetch(`${API_URL}&t=${query}`);

    return await res.json();
  } catch {
    return {
      Response: 'False',
      Error: 'unexpected error',
    };
  }
}
