import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

function isMovieUnique(movie, moviesList) {
  return !moviesList.some(movieItem => movieItem.imdbId === movie.imdbId);
}

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (movie) => {
    if (isMovieUnique(movie, movies)) {
      setMovies([...movies, movie]);
    }
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
        />
      </div>
    </div>
  );
};
