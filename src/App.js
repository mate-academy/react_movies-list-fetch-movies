import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, makeMoviesList] = useState(data);
  const addMovie = (movieToAdd) => {
    if (!movies.some(movie => movie.imdbId === movieToAdd.imdbId)) {
      makeMoviesList(prevMovies => [...prevMovies, movieToAdd]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onMovieAdd={addMovie} />
      </div>
    </div>
  );
};
