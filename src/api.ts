import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/?i=tt3896198&apikey=a3734d37';

export const getMovie = async (
  query: string,
): Promise<MovieData | ResponseError> => {
  const response = await fetch(`${API_URL}&t=${query}`);

  return response.json();
};
