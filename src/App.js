import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);

  const addMovie = (newMovie) => {
    if (movies.some(movie => movie.imdbID === newMovie.imdbID)
      || error) {
      return;
    }

    setMovies(movie => [...movie, newMovie]);
  };

  const clearMovies = () => {
    setMovies([]);
  };

  return (
    <div className="page">

      <div className="page-content">
        {movies.length ? (
          <MoviesList movies={movies} clear={clearMovies} />
        ) : (
          <div className="panel-heading">No movies</div>
        )}
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          setError={setError}
          error={error}
        />
      </div>

    </div>
  );
};
