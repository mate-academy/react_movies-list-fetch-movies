import { MovieData } from './MovieData';

export interface ResponseError {
  Response: 'False',
  Error: string,
}

export function isResponseError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return (data as ResponseError).Response === 'False';
}
