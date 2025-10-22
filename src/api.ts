import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'http://www.omdbapi.com/?&apikey=ff39506f';

export async function getMovie(
  query: string,
): Promise<MovieData | ResponseError> {
  const res = await fetch(`${API_URL}&t=${query}`);

  if (!res.ok) {
    throw new Error('error');
  }

  const data = (await res.json()) as ResponseError;

  if (data.Response == 'False') {
    throw new Error(data.Error || 'Error');
  }

  return data;
}
