import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const checkMovie = (movieFromServer) => {
    const sameMovie = movies.find(
      movie => movie.imdbId === movieFromServer.imdbId,
    );

    if (sameMovie) {
      return;
    }

    setMovies([
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
        <FindMovie addMovie={checkMovie} />
      </div>
    </div>
  );
};
