import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import './App.scss';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (newMovie) => {
    setMovies(currentMovies => [...currentMovies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          movies={movies}
        />
      </div>
    </div>
  );
};
