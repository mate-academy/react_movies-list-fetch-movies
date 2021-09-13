import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Film } from './types/Film';
import data from './api/movies.json';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Film[]>(data);
  const addFilm = (newFilm: Film) => {
    if (movies.some((film) => newFilm.imdbId === film.imdbId)) {
      return;
    }

    setMovies((state) => {
      return [
        ...state,
        newFilm,
      ];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addFilm={addFilm} />
      </div>
    </div>
  );
};
