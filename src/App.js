import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const addMovie = (foundMovie) => {
    if (movies.find(item => item.imdbId === foundMovie.imdbId)) {
      return;
    }

    setMovies([...movies, foundMovie]);
  };

  return (
    <>
      <div className="page">
        <div className="page-content">
          <MoviesList
            movies={movies}
          />
        </div>
        <div className="sidebar">
          <FindMovie
            addMovie={addMovie}
          />
        </div>
      </div>
    </>
  );
};
