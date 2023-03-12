import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, updateMoviesList] = useState<Movie[]>([]);

  const handleMoviesList = (movie: Movie): void => {
    if (!movies.find(film => film.imdbId === movie.imdbId)) {
      updateMoviesList([
        ...movies,
        movie,
      ]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleMoviesList} />
      </div>
    </div>
  );
};
