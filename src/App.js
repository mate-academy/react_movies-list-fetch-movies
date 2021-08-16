import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const moviesKey = 'movies';

  const moviesFromStorage = JSON.parse(window.localStorage.getItem(moviesKey));

  const [movies, setMovies] = useState(moviesFromStorage || data);

  const stringifiedMovies = JSON.stringify(movies);

  const addNewMovie = (newMovie) => {
    if (newMovie !== null
      && (!movies.some(movie => movie.imdbId === newMovie.imdbId))) {
      setMovies([...movies, newMovie]);
    }
  };

  window.localStorage.setItem(moviesKey, stringifiedMovies);

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
