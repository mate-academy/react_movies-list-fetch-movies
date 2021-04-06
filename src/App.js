import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import data from './api/movies.json';
import './App.scss';

export const App = () => {
  const [movies, setMovie] = useState(data);

  const addMovie = (movie) => {
    setMovie([...movies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAdd={addMovie}
          movies={movies}
        />
      </div>
    </div>
  );
};
