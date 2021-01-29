import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export function App() {
  const [movies, setMovies] = useState([]);

  const addMovie = (movie) => {
    if (movies.some(mov => mov.imdbID === movie.imdbID)) {
      return;
    }

    setMovies(prevMovies => [movie, ...prevMovies]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie movies={movies} addMovie={addMovie} />
      </div>
    </div>
  );
}
