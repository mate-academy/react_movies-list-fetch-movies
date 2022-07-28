import { MovieData } from './types/MovieData';

const API_URL = 'https://www.omdbapi.com/?apikey=1c6320fb';

const wait = (delay: number) => {
  return new Promise(resolve => setTimeout(resolve, delay));
};

export const request = async (query: string): Promise<MovieData> => {
  await wait(1000);
  const response = await fetch(`${API_URL}&t=${query}`);

  if (!response.ok) {
    Promise.reject(new Error(''));
  }

  return response.json();
};
