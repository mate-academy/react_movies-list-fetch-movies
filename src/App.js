import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovie] = useState(data);

  const addMovieToList = (movie) => {
    if (!movie) {
      return;
    }

    const check = movies.some(film => (
      film.imdbID === movie.imdbID));

    if (check) {
      return;
    }

    setMovie(element => [...element, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovieToList} />
      </div>
    </div>
  );
};
