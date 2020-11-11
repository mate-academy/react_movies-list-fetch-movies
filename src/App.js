import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  function addMovie(movie) {
    setMovies(currentMovies => [...currentMovies, movie]);
  }

  function hasMovie(movie) {
    return movies.some(({ imdbId }) => imdbId === movie.imdbId);
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} hasMovie={hasMovie} />
      </div>
    </div>
  );
};
