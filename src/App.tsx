import React, { useState } from 'react';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import './App.scss';

export const App: React.FC = () => {
  const [moviesList, setMoviesList] = useState<Movie[]>([]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={moviesList} />
      </div>
      <div className="sidebar">
        <FindMovie movies={moviesList} setMoviesList={setMoviesList} />
      </div>
    </div>
  );
};
