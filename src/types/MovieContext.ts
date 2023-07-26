import { Movie } from './Movie';

export type Context = {
  movies: Movie[];
  searchField: string;
  updateSearch: (term: string) => void;
  onSearchMovie: (term: string) => void;
  findMovieLoading: boolean;
  findMovieError: boolean;
  findMovie: Movie | null;
  onAddMovie: (movie: Movie) => void;
  onResetData: () => void;
};
