import React, { useState, useCallback } from 'react';
import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = React.memo(() => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    if (movies.some(movieOnPage => movieOnPage.imdbID === movie.imdbID)) {
      return;
    }

    setMovies([...movies, movie]);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addOnPage={addMovie} />
      </div>
    </div>
  );
});
