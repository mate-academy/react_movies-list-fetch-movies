import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_KEY = process.env.REACT_APP_OMDB_API_KEY;
const API_URL = `https://www.omdbapi.com/?apikey=${API_KEY}`;

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  try {
    const res = await fetch(`${API_URL}&t=${encodeURIComponent(query)}`);

    if (!res.ok) {
      return { Response: 'False', Error: 'Network error' };
    }

    return (await res.json()) as MovieData | ResponseError;
  } catch {
    return { Response: 'False', Error: 'Unexpected error' };
  }
}
