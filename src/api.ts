import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=326fe605';

export async function getMovie(query: string): Promise<MovieData> {
  const res = await fetch(`${API_URL}&t=${query}`);
  const result = await res.json();

  if (result.Response === 'False') {
    throw new Error(`${result.Error}`);
  }

  return result;
}
