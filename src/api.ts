import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ReponseError';

const API_URL = 'https://www.omdbapi.com/';
const apiKey = 'd049b4a';

export const getMovie = async (query: string):
Promise<MovieData | ResponseError> => {
  try {
    const response = await fetch(`${API_URL}?apikey=${apiKey}&t=${query}`);

    return await response.json();
  } catch (error) {
    throw new Error(`Unexpected error: ${error}`);
  }
};
