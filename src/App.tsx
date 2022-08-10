import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './react-app-env';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onChange = useCallback((movie) => {
    const newMovies = [...movies, movie];

    setMovies(newMovies);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onChange={onChange} movies={movies} />
      </div>
    </div>
  );
};
