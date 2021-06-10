import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import data from './api/movies.json';

export const App = () => {
  const [allMovies, setAllMovies] = useState([...data]);

  const addMovie = (movie) => {
    const includedMovie = allMovies.find(el => el.imdbId === movie.imdbId);

    if (!includedMovie) {
      setAllMovies([...allMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={allMovies} />
      </div>
      <div className="sidebar">
        <FindMovie addedMovie={addMovie} />
      </div>
    </div>
  );
};
