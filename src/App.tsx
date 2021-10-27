import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (newMovie: Movie): void => {
    const isAlreadyExist = movies.some(movie => movie.imdbID === newMovie.imdbID);

    if (!isAlreadyExist) {
      setMovies(current => [...current, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={handleAddMovie} />
      </div>
    </div>
  );
};
