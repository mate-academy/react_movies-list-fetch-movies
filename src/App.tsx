import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, addMovie] = useState<Movie[]>([]);

  const handleMovie = (newMovie: Movie): void => {
    if (movies.find(movie => movie.imdbID === newMovie.imdbID)) {
      return;
    }

    addMovie(current => [newMovie, ...current]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={handleMovie} />
      </div>
    </div>
  );
};
