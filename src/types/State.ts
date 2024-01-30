import { Movie } from './Movie';

export interface State {
  movies: Movie[];
  movie: Movie | null;
  query: string;
  isMovie: boolean;
  showError: boolean;
}
