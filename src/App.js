import React, { useState } from 'react';

import './App.scss';

import data from './api/movies.json';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (newMovie) => {
    const { imdbUrl } = newMovie;
    const isUnique = movies.some(movie => movie.imdbUrl === imdbUrl);

    if (!isUnique === false) {
      return;
    }

    setMovies(currentMovies => [...currentMovies, newMovie]);
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
