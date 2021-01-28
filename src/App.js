import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, updateMovies] = useState(data);

  const addMovie = (movie) => {
    const isDuplicate = movies
      .some(film => film.imdbId === movie.imdbId);

    if (!isDuplicate) {
      updateMovies(prevMovies => ([
        ...prevMovies,
        movie,
      ]));
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onMovieAdd={addMovie}
        />
      </div>
    </div>
  );
};
