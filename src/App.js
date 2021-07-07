import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const checkMovie = (loadedMovie) => {
    const sameMovie = movies.find(movie => movie.imdbId === loadedMovie.imdbId);

    if (sameMovie || loadedMovie === '') {
      return;
    }

    setMovies([
      ...movies,
      loadedMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={checkMovie}
        />
      </div>
    </div>
  );
};
