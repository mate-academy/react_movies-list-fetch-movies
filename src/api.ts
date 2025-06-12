import { MovieData } from './types/MovieData';
import { ResponseError } from './types/ResponseError';

const API_KEY = 'YOUR_OMDB_API_KEY';
const BASE_URL = 'https://www.omdbapi.com/';

export const getMovie = async (
  title: string,
): Promise<MovieData | ResponseError> => {
  const url = `${BASE_URL}?apikey=${API_KEY}&t=${encodeURIComponent(title)}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    return {
      Response: 'False',
      Error: 'Network error or API unavailable',
    };
  }
};
