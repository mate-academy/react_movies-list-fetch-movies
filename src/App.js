import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovies] = useState(data);

  const addMovie = newMovie => (
    !movies.find(movie => movie.title === newMovie.title))
      && addMovies(prev => [...prev, newMovie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovies={addMovie} />
      </div>
    </div>
  );
};
