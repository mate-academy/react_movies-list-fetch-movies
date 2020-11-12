import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addNewMovie = (newMovie) => {
    const hasAlreadyMovie = movies.find(movie => (
      movie.imdbUrl === newMovie.imdbUrl
    ));

    if (!hasAlreadyMovie) {
      setMovies([...movies, newMovie]);
    }
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
