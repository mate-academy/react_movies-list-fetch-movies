import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=1c6320fb';

export const request = async (query: string): Promise<MovieData> => {
  const response = await fetch(`${API_URL}&t=${query}`);

  if (!response.ok) {
    Promise.reject(new Error(''));
  }

  return response.json();
};
