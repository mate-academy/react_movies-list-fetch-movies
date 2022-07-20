import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovie] = useState(data);

  const onAddMovie = (newMovie) => {
    const moviesIds = movies.map(
      ({ imdbID }) => imdbID,
    );

    if (!moviesIds.includes(newMovie.imdbID)) {
      addMovie([newMovie, ...movies]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={onAddMovie} />
      </div>
    </div>
  );
};
