/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  console.log('rendering App');

  const [movies, setMovies] = useState<Movie[]>([]);

  useEffect(() => {
    console.log('movies array =', movies);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          setMovies={setMovies}
        />
      </div>
    </div>
  );
};
