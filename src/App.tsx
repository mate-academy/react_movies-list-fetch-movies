import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = (movieFromServer: Movie) => {
    if (!movies.some(({ imdbID }) => movieFromServer.imdbID === imdbID)) {
      setMovies([...movies, movieFromServer]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
