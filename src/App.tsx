import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MoviesContext } from './contexts/MoviesContext';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  return (
    <MoviesContext.Provider value={{ movies, setMovies }}>
      <div className="page">
        <div className="page-content">
          <MoviesList />
        </div>
        <div className="sidebar">
          <FindMovie />
        </div>
      </div>
    </MoviesContext.Provider>
  );
};
