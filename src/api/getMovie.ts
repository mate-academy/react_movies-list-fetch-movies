import { URL } from './constants';

export const getMovie = async (query: string): Promise<MovieFromServer> => {
  const response = await fetch(URL + query);

  return response.json();
};
