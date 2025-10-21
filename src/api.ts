import { MovieData } from './types/MovieData';

const API_URL = 'http://www.omdbapi.com/?i=tt3896198&apikey=ff39506f';

export async function getMovie(query: string): Promise<MovieData> {
  const res = await fetch(`${API_URL}&t=${query}`);

  if (!res.ok) {
    throw new Error('Loading data failed');
  }

  const data = res.json();

  return data;
}
