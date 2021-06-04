import React, { useState } from 'react';

import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [isNewMovieAlreadyInList, setNewMovieAlreadyInList] = useState(false);

  const resetMovieAlreadyInList = () => {
    setNewMovieAlreadyInList(false);
  };

  const addMovie = (newMovie) => {
    if (movies.find(movie => movie.imdbId === newMovie.imdbId)) {
      setNewMovieAlreadyInList(true);

      return;
    }

    setMovies(movies.concat(newMovie));

    resetMovieAlreadyInList();
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          resetMovieAlreadyInList={resetMovieAlreadyInList}
          isNewMovieAlreadyInList={isNewMovieAlreadyInList}
        />
      </div>
    </div>
  );
};
