import { useCallback, useState } from 'react';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import { Movie } from './types/Movie';

import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovies = useCallback(
    (movie: Movie) => {
      const dubleMovie = movies.find(film => film.imdbId === movie.imdbId);

      if (dubleMovie) {
        return;
      }

      setMovies(prevList => [...prevList, movie]);
    },
    [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovies={addMovies} />
      </div>
    </div>
  );
};
