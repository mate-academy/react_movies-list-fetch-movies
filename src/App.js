import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
// import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const moviesAdder = (movie) => {
    if (movies.find(item => item.Title === movie.Title)) {
      return;
    }

    setMovies(current => [...current, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {!movies.length ? '' : (<MoviesList movies={movies} />)}
      </div>
      <div className="sidebar">
        <FindMovie moviesAdder={moviesAdder} />
      </div>
    </div>
  );
};
