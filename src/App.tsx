import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import './App.scss';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie): void => {
    const includeMovie = movies.some(({ imdbID }) => movie.imdbID === imdbID);

    if (!includeMovie) {
      setMovies(currentMovies => [...currentMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
