import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);

  const addMovie = (findedMovie) => {
    setMovie((availableMovies) => {
      const moviesForCompare = availableMovies
        .filter(movie => movie.imdbID !== findedMovie.imdbID);

      if (availableMovies.length === moviesForCompare.length
        && findedMovie.imdbID) {
        return [...availableMovies, findedMovie];
      }

      return availableMovies;
    });
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
