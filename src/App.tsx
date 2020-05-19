import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [usedMovieError, setUsedMovieError] = useState(false);

  const addMovie = useCallback((movie: Movie) => {
    if (movies.find(el => el.imdbId === movie.imdbId)) {
      setUsedMovieError(true);
    } else {
      setMovies(state => ([...state, movie]));
      setUsedMovieError(false);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          usedMovieError={usedMovieError}
        />
      </div>
    </div>
  );
};
