import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setstate] = useState(data);

  const addMovie = (moviToAdd) => {
    const checkMovie = movies.find(movie => movie.imdbId === moviToAdd.imdbId);

    if (checkMovie) {
      return;
    }

    setstate([...movies, moviToAdd]);
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
