/* eslint-disable no-console */
import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [errMess, setErrMess] = useState<string>('');

  const addMovie = (movie: Movie | null) => {
    if (!movie) {
      return;
    }

    const check = movies.find(mov => mov.imdbID === movie.imdbID);

    if (check) {
      console.log('Movie is already added to the list!');
      setErrMess('Movie is already added to the list!');

      return;
    }

    setMovies((prev) => [...prev, movie]);
  };

  const cancelErrMess = () => {
    setErrMess('');
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          errMess={errMess}
          cancelErrMess={cancelErrMess}
        />
      </div>
    </div>
  );
};
