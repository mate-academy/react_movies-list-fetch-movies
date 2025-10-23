import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?&apikey=ff39506f';

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  try {
    const res = await fetch(`${API_URL}&t=${encodeURIComponent(query.trim())}`);
    const data = await res.json();

    if (!res.ok) {
      return {
        Response: 'False',
        Error: `HTTP ${res.status} ${res.statusText}`,
      };
    }

    return data as MovieData | ResponseError;
  } catch {
    return { Response: 'False', Error: 'Network Error, try again' };
  }
}
