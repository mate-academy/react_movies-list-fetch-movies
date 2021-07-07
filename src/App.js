import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addFilm = (film) => {
    if (
      !movies.find(movie => movie.imdbId === film.imdbId)
      && film.length !== 0
    ) {
      setMovies(current => [...current, film]);
    }
  };

  return (
    <>
      <div className="page">
        <div className="page-content">
          <MoviesList movies={movies} />
        </div>
        <div className="sidebar">
          <FindMovie
            onAdd={addFilm}
          />
        </div>
      </div>
    </>
  );
};
