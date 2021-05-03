import React, { useState, useEffect } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(data);
  }, []);

  const addMovie = (newMovie) => {
    if (newMovie) {
      setMovies((prevMovies) => {
        const exists = prevMovies
          .find(movie => movie.imdbId === newMovie.imdbId);

        return !exists
          ? [...prevMovies, newMovie]
          : prevMovies;
      });
    }
  };

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
