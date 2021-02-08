import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);
  const [error, setError] = useState('');

  const addMovie = (movie) => {
    if (!movies
      .some(displayedMovie => displayedMovie.imdbId === movie.imdbId)) {
      setMovie(prevMovies => [...prevMovies, movie]);
    } else {
      setError('Movie already in the list');
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} setError={setError} error={error} />
      </div>
    </div>
  );
};
