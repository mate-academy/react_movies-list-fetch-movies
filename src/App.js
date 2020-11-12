import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);

  const addMovie = (movie) => {
    setMovie(currentMovies => [...currentMovies, movies]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {!!movies.length && (
          <MoviesList movies={movies} />
        )}
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
