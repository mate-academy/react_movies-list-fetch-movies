import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (newMovie) => {
    setMovies(prevMovies => [...prevMovies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        {movies.length
          ? <MoviesList movies={movies} />
          : (
            <h2>
              Add movies to your list
            </h2>
          )
        }
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
