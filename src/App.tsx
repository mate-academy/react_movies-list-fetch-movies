import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import React from 'react';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies((currentMovies: Movie[]) => [...currentMovies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie handleAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
