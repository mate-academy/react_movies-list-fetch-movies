import { MovieData } from '../types/MovieData';

export const isMovieData = (data: unknown): data is MovieData => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'Poster' in data &&
    typeof data.Poster === 'string' &&
    'Title' in data &&
    typeof data.Title === 'string' &&
    'Plot' in data
  );
};
