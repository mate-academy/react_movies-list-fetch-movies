/* eslint-disable no-console */
import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState <Movie[]>([]);

  const addMovie = (theMovie: Movie) => {
    setMovies((prev) => {
      if (prev.some((movie) => movie.imdbID === theMovie.imdbID)) {
        return (
          [...prev]
        );
      }

      return (
        [...prev, theMovie]
      );
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAdd={addMovie}
          ifMovieAdded={movies}
        />
      </div>
    </div>
  );
};
