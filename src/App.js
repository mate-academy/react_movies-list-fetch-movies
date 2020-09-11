import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovie] = useState([...data]);

  const addNewMovie = (movie) => {
    if (!movies.some(mov => mov.imdbId === movie.imdbId)) {
      setMovie([...movies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addNewMovie={addNewMovie}
        />
      </div>
    </div>
  );
};
