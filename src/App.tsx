import {
  useState,
  FC,
  useCallback,
} from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    const isNewMovie = !movies
      .find(addedMovie => addedMovie.title === movie?.title);

    if (movie && isNewMovie) {
      setMovies(state => (
        [
          ...state,
          movie,
        ]
      ));
    }
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
