import { BASE_URL } from './constants';

export const getMovie = async (query: string): Promise<MovieFromServer> => {
  return fetch(BASE_URL + query)
    .then(response => response.json());
};
