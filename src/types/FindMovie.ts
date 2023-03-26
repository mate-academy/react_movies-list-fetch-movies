import { Movie } from './Movie';

export interface FindMovieProps {
  movie: Movie | null;
  setMovie: (movie: Movie) => void;
  handleAddMovie: () => void;
}
