import { request } from './request';

const apiKey = '8327dd52';

export const getMovie = (addUrl: string): Promise<Movie | FetchMovieErrorResponse> => request(
  `?i=tt3896198&apikey=${apiKey}&t=${addUrl}`,
);
