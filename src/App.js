import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovie] = useState(data);

  const addNewMovie = (newMovie) => {
    if (movies.some(
      movie => movie.imdbId === newMovie.imdbId,
    )) {
      return;
    }

    addMovie([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNewMovie={addNewMovie} />
      </div>
    </div>
  );
};
