import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

export function isMovieData(
  data: MovieData | ResponseError,
): data is MovieData {
  return (
    (data as MovieData).Title !== undefined
    && (data as MovieData).Plot !== undefined
    && (data as MovieData).Poster !== undefined
    && (data as MovieData).imdbID !== undefined
  );
}
