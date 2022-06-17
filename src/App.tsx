import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App:React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovies = (value: Movie) => {
    const dublicate = movies.some(item => item.imdbID === value.imdbID);

    if (!dublicate) {
      setMovies([...movies, value]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovies={addMovies} />
      </div>
    </div>
  );
};
