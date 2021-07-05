import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovie] = useState(data);

  const addMovieToList = (newMovie) => {
    (!movies.some(movie => movie.imdbId === newMovie.imdbId))
    && (addMovie([...movies, newMovie]));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovieToList} />
      </div>
    </div>
  );
};
