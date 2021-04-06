import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [error, setError] = useState(false);

  const addNewMovie = (newMovie) => {
    if (movies.find(movie => movie.imdbId === newMovie.imdbId)
      || !newMovie.imdbId) {
      setError(true);

      return;
    }

    setMovies(prevMoviesList => [newMovie, ...prevMoviesList]);
    setError(false);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAdd={addNewMovie}
          setError={setError}
          error={error}
        />
      </div>
    </div>
  );
};
