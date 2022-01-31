import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[] | []>([]);

  const addMovie = (movieFromServer: Movie) => {
    setMovies(currentList => [...currentList, movieFromServer]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} moviesList={movies} />
      </div>
    </div>
  );
};
