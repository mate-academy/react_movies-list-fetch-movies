import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (movie) => {
    if (movie === null) {
      return;
    }

    if (movies.some(film => film.imdbUrl === movie.imdbUrl) === true) {
      return;
    }

    setMovies(currentMovies => [...currentMovies, movie]);
  };

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
