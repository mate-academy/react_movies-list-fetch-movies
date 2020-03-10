import React, { useState, FC } from 'react';

import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';

import data from './api/movies.json';
import { MovieForApp } from './constants/types';
import './App.scss';


export const App: FC = () => {
  const [movies, setMovies] = useState<MovieForApp[]>(data);

  const addMovie = (newMovie: MovieForApp): void => {
    const movieIndex = movies.findIndex(
      movie => movie.imdbId === newMovie.imdbId,
    );

    if (movieIndex === -1) {
      setMovies(prevMovies => ([
        ...prevMovies,
        newMovie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onMovieAdd={addMovie} />
      </div>
    </div>
  );
};
