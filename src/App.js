import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { defaultMovies } from './api/api';

export const App = () => {
  const [movies, setMovies] = useState(defaultMovies);

  const addMovie = (newMovie) => {
    setMovies([
      ...movies,
      newMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} movies={movies} />
      </div>
    </div>
  );
};
