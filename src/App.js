import React, { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = useCallback((newMovie) => {
    if (!movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, newMovie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} movies={movies} />
      </div>
    </div>
  );
};
