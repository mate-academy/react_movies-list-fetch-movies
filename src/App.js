import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';
import { getMoviesByTitle } from './api/movies';

getMoviesByTitle('yt');

export const App = () => {
  const [movies, setMovies] = useState(data);

  function addMovie(movie) {
    if (movies.some(({ imdbId }) => imdbId === movie.imdbId)) {
      return;
    }

    setMovies(currentMovies => [...currentMovies, movie]);
  }

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
