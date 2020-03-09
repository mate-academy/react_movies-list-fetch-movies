import React, { FC, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { data } from './api/movies';

export const App: FC = () => {
  const [movies, setMovies] = useState<Movie[]>(data);

  const addMovie = (newMovie: Movie) => {
    setMovies([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie movies={movies} addMovie={addMovie} />
      </div>
    </div>
  );
};
