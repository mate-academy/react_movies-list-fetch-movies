/* eslint-disable no-alert */
import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = (addedMovie: Movie) => {
    if (movies.some((element) => element.imdbId === addedMovie.imdbId)) {
      alert('This movie was added already');

      return;
    }

    setMovies([
      ...movies,
      addedMovie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
