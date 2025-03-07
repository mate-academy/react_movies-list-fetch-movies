import { Movie } from './Movie';

export type FindMovieProps = {
  onAddMovie: (movie: Movie) => void;
  movies: Movie[];
};
