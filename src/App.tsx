import React, { useState } from 'react';

import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

import movieFromServer from './api/movieFromServer.json';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<MovieApi[]>(movieFromServer);

  const addMovie = (newMovie: MovieApi) => {
    if (!movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
