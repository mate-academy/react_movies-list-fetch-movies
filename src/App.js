import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(false);

  const addNewMovie = (newMovie) => {
    if (movies.some(movie => movie.imdbID === newMovie.imdbID)
      || error) {
      return;
    }

    setMovies(current => [...current, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length ? (
          <MoviesList movies={movies} />
        ) : (
          <h2>Movie list is empty</h2>
        )}
      </div>
      <div className="sidebar">
        <FindMovie
          onAdd={addNewMovie}
          error={error}
          setError={setError}
        />
      </div>
    </div>
  );
};
