import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addNewMovie = (movie) => {
    const movieAlreadyHave = movies
      .some(movieItem => movie.imdbID === movieItem.imdbID);

    if (movieAlreadyHave) {
      return;
    }

    setMovies(currentState => [...currentState, movie]);
  };

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
