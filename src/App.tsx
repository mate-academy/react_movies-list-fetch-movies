import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import React from 'react';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const addMovie = (newMovie: Movie) => {
    const isDuplicate = movies.some(m => m.imdbId === newMovie.imdbId);

    if (!isDuplicate) {
      setMovies(prev => [...prev, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={addMovie} />
      </div>
    </div>
  );
};
