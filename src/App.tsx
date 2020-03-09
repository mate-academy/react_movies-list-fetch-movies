import React, { FC, useState } from 'react';
import './App.scss';
import { Movie } from './constants/types';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>(data);

  const addNewMovie = (newMovie: Movie): void => {
    setMovies([
      ...movies,
      newMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNewMovie={addNewMovie} />
      </div>
    </div>
  );
};
