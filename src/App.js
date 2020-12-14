import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import moviesFromServer from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(moviesFromServer);

  const addMovie = (movie) => {
    setMovies(currentMovies => [...currentMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length ? <MoviesList movies={movies} />
          : 'Add a movies'}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} movies={movies} />
      </div>
    </div>
  );
};
