import { Movie } from './types/Movie';

const API_URL = 'https://www.omdbapi.com/?apikey=326fe605';

export async function getMovie(query: string): Promise<Movie> {
  const object: Movie = {
    data: null,
    error: null,
  };
  const res = await fetch(`${API_URL}&t=${query}`);
  const result = await res.json();

  if (result.response === 'False') {
    object.error = result;
  } else {
    object.data = result;
  }

  return object;
}
