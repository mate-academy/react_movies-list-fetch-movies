import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import userMoviesList from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(userMoviesList);

  const addMovie = (newMovie) => {
    if (movies.some(
      movie => movie.imdbId === newMovie.imdbId,
    )) {
      return;
    }

    setMovies(prevMovies => [...prevMovies, newMovie]);
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
