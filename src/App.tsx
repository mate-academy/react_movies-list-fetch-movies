import React, { useState } from 'react';

import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <p>hello</p>
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie setMovies={setMovies} />
      </div>
    </div>
  );
};
