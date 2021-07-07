import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, addMovie] = useState(data);

  const newMovies = (newMovie) => {
    if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      return;
    }

    addMovie([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movies={movies}
          newMovies={newMovies}
        />
      </div>
    </div>
  );
};
