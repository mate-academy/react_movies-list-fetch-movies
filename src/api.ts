import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=5a03dcb7';

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  const response = await fetch(`${API_URL}&t=${query}`);

  try {
    return await response.json();
  } catch {
    return ({
      Response: 'False',
      Error: 'unexpected error',
    });
  }
}
