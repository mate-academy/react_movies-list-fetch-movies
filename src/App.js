import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);
  const [error, setError] = useState('');

  const addMovie = (movie) => {
    if (movies.some(displayedMovie => displayedMovie.imdbID === movie.imdbID)) {
      setError('Movie already in the list');
    } else {
      setMovie(prevMovies => [...prevMovies, movie]);
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
