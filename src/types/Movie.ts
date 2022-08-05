import { MovieData } from './MovieData';
import { ResponseError } from './ReponseError';

export interface Movie {
  data: MovieData | null;
  error: ResponseError | null;
}
