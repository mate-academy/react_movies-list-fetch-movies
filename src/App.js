import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, updateMovies] = useState(data);

  const addMovie = (movieFromServer) => {
    const newMovie = movies.find(movie => (
      movie.imdbId === movieFromServer.imdbId
    ));

    if (newMovie) {
      return;
    }

    updateMovies([
      ...movies,
      movieFromServer,
    ]);
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
