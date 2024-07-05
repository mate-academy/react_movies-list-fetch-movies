import { ResponseError } from './ReponseError';

export function isError<T extends object>(
  data: T | ResponseError,
): data is ResponseError {
  return Object.hasOwn(data, 'Error');
}
