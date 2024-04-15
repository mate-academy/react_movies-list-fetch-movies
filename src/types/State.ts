import { Movie } from '../types/Movie';

export interface State {
  movies: Movie[];
  query: string;
  error: string;
}
