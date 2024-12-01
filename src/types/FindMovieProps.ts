import { Movie } from './Movie';

export interface FindMovieProps {
  addToList: (movie: Movie) => void;
}
