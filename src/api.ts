import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=c907c449';

export async function getMovie(query: string): Promise<MovieData | ResponseError> {
  try {
    const res = await fetch(`${API_URL}&t=${encodeURIComponent(query)}`);

    if (!res.ok) {
      return { Response: 'False', Error: 'Network error' };
    }

    return await res.json();
  } catch {
    return { Response: 'False', Error: 'Unexpected error' }
  }
}
