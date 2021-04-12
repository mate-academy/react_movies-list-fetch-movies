import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (movieFromSearch) => {
    if (movies.some(movie => movie.imdbID === movieFromSearch.imdbID)) {
      return;
    }

    setMovies([...movies, movieFromSearch]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length > 0 && (<MoviesList movies={movies} />)}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
