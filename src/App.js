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

  const addMovie = (movie) => {
    if (movies.find(film => film.imdbId === movie.imdbId)) {
      return;
    }

    setMovies(prevMovies => [...prevMovies, movie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAddMovie={addMovie}
        />
      </div>
    </div>
  );
};
