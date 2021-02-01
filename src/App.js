import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovie] = useState([]);

  const addMovie = (film) => {
    setMovie((prevMovies) => {
      if (prevMovies
        .every(item => item.imdbID !== film.imdbID) && film.imdbID) {
        return [...prevMovies, film];
      }

      return prevMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length ? (
          <MoviesList movies={movies} />
        ) : (
          <div>
            No Movies
          </div>
        )}
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
