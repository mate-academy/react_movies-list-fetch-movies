import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export function App() {
  const [movies, setMovies] = useState(data);
  const [isFound, setIsFound] = useState(true);

  const addMovie = (newMovie) => {
    if (isFound) {
      if (movies.some(movie => movie.imdbId === newMovie.imdbId)) {
        return;
      }

      setMovies([...movies, newMovie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          isFound={isFound}
          setIsFound={setIsFound}
        />
      </div>
    </div>
  );
}
