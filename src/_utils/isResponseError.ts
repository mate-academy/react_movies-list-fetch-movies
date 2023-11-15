import { MovieData } from '../types/MovieData';
import { ResponseError } from '../types/ReponseError';

export function isResponseError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return (data as ResponseError).Response === 'False';
}
