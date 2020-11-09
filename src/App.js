import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovies = (newMovie) => {
    if (!customIncludes(movies, newMovie)) {
      setMovies([...movies, newMovie]);
    }
  };

  const customIncludes = (array, item) => {
    let ind = 0;

    array.forEach((element) => {
      if (element.imdbUrl === item.imdbUrl) {
        ind = 1;
      }
    });

    return ind;
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovies} />
      </div>
    </div>
  );
};
