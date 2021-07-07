import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovies = (newMovie) => {
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
        <FindMovie addMovie={addMovies} />
      </div>
    </div>
  );
};
