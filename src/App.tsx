import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

type Props = {};

export const App: React.FC<Props> = () => {
  const [movies, setMovies] = useState([] as Movie[]);

  const addNewMovie = (newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbID === newMovie.imdbID)) {
      setMovies([...movies, newMovie]);
    }
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
