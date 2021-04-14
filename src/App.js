import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import initialMovies from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(initialMovies);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          setMovies={setMovies}
          movies={movies}
        />
      </div>
    </div>
  );
};
