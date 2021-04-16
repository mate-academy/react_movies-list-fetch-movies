import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [hiddenErMovieRepeat, setHiddenErMovieRepeat] = useState(true);

  const addMovie = (movie) => {
    if (movie.title === undefined) {
      setHiddenErMovieRepeat(false);

      return;
    }

    setMovies(current => [
      ...current,
      movie,
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          movies={movies}
          addMovie={addMovie}
          setHiddenErMovieRepeat={setHiddenErMovieRepeat}
          hiddenErMovieRepeat={hiddenErMovieRepeat}
        />
      </div>
    </div>
  );
};
