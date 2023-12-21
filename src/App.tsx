import { useState } from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import type { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (newMovie: Movie) => {
    setMovies(currentMovies => {
      const isAlreadyAdded = currentMovies.some(
        movie => movie.imdbId === newMovie.imdbId,
      );

      if (isAlreadyAdded) {
        return currentMovies;
      }

      return [...currentMovies, newMovie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={addMovie}
        />
      </div>
    </div>
  );
};
