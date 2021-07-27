import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (movie) => {
    if (!isAlreadyInTheList(movie)) {
      setMovies(films => [...films, movie]);
    }
  };

  const isAlreadyInTheList = movie => movies
    .some(film => film.imdbId === movie.imdbId);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onSubmit={addMovie} />
      </div>
    </div>
  );
};
