import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, updateMovies] = useState(data);

  const addMovie = (newMovie) => {
    const hasCopy = movies.find(item => newMovie.imdbId === item.imdbId);

    if (hasCopy) {
      return;
    }

    updateMovies([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movies={movies}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
