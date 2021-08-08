import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import value from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(value);
  const addCardMovie = (newMovie) => {
    if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    setMovies([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onClick={addCardMovie}
        />
      </div>
    </div>
  );
};
