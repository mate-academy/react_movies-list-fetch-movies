import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);
  const addMovie = (film) => {
    setMovie((oldMovies) => {
      if (oldMovies.every(item => item.imdbID !== film.imdbID) && film.imdbID) {
        return [...oldMovies, film];
      }

      return oldMovies;
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
