import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [addingError, setAddingError] = useState(false);

  const addMovie = useCallback((movie: Movie) => {
    if (movies.find(el => el.imdbId === movie.imdbId)) {
      setAddingError(true);
    } else {
      setMovies(state => ([...state, movie]));
      setAddingError(false);
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
          addingError={addingError}
        />
      </div>
    </div>
  );
};
