import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovie] = useState(data);

  const addMovie = (movieToAdd) => {
    const duplicate = movies.find(movie => movie.imdbId === movieToAdd.imdbId);

    if (duplicate) {
      return;
    }

    setMovie(currentMovies => [...currentMovies, movieToAdd]);
  };

  return (
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
  );
};
