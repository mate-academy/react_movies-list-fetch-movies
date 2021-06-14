import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovie = (newMovie) => {
    const { imdbId } = newMovie;
    const isSearchSuccessful = movies.some(movie => movie.imdbId === imdbId);

    if (!isSearchSuccessful) {
      setMovies(currentMovies => [
        ...currentMovies,
        newMovie,
      ]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
