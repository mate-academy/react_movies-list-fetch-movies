import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [isMovieAdded, setDuplicatedId] = useState(false);

  const addMovie = (newMovie) => {
    if (!newMovie.imdbId
      || movies.find(movie => movie.imdbId === newMovie.imdbId)
    ) {
      setDuplicatedId(true);

      return;
    }

    setDuplicatedId(false);
    setMovies(prevMovies => [newMovie, ...prevMovies]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList
          movies={movies}
        />
      </div>
      <div className="sidebar">
        <FindMovie
          setDuplicatedId={setDuplicatedId}
          isMovieAdded={isMovieAdded}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
