import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'http://www.omdbapi.com/?apikey=6e71127';

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
