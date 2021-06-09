import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addFilm = (film) => {
    const addFilmToList = movies.some(
      item => item.imdbId === film.imdbId,
    );

    if (!addFilmToList) {
      setMovies(state => [...state, film]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onFindFilm={addFilm} />
      </div>
    </div>
  );
};
