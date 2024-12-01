import { ResponseError } from '../../types/ResponseError';
import { MovieData } from '../../types/MovieData';

export function isResponseError(
  response: MovieData | ResponseError,
): response is ResponseError {
  return (response as ResponseError).Response === 'False';
}
