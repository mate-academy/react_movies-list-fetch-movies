import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?apikey=f17a064d';

type PromiseResult = MovieData | ResponseError;

export async function getMovie(query: string): Promise<PromiseResult> {
  try {
    const response = await fetch(`${API_URL}&t=${query}`);
    const data = await response.json();

    if (data.Response === 'False') {
      return { Response: 'False', Error: 'unexpected error' };
    }

    return data as MovieData;
  } catch (error) {
    return { Response: 'False', Error: 'unexpected error' };
  }
}
