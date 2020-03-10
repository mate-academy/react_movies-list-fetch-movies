import { API_BASE_URL } from '../constants/getMovieConstants';

export async function getNewMovie(movie: string): Promise<NewMovie> {
  const response = await fetch(`${API_BASE_URL}${movie}`);
  const data: ImdbResponse = await response.json();

  if (data.Response === 'False') {
    throw new Error(data.Error);
  }

  return data as unknown as NewMovie;
}
