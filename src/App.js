import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (newMovie) => {
    setMovies(currentMovies => [...currentMovies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length
          ? <MoviesList movies={movies} />
          : (
            <h2>
              Add your movies
            </h2>
          )
        }
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          movies={movies}
        />
      </div>
    </div>
  );
};
