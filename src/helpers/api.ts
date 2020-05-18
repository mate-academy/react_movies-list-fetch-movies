import { URL_API } from '../constants';

export const getMovie = (movieTitle: string): Promise<MovieFormServer> => {
  return fetch(`${URL_API}&t=${movieTitle}`)
    .then(response => response.json());
};
