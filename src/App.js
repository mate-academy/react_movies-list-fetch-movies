import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovie] = useState(data);
  const [errorMessage, toMessage] = useState(false);

  const addedMovie = (newMovie) => {
    if (!newMovie) {
      return;
    }

    if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      toMessage(true);
      setTimeout(() => {
        toMessage(false);
      }, 2000);

      return;
    }

    addMovie([
      ...movies,
      newMovie,
    ]);
  };

  return (
    <div className="page">
      {
        !errorMessage
        || (
          <span className="error">This movie is already in the list!</span>
        )
      }
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addedMovie={addedMovie} />
      </div>
    </div>
  );
};
