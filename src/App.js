import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);
  const addNewMovie = (newMovie) => {
    const checkMovieImbd = movies.find(e => e.imdbID === newMovie.imdbID);

    if (checkMovieImbd || !newMovie.Title) {
      return;
    }

    setMovies([...movies, newMovie]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNew={addNewMovie} />
      </div>
    </div>
  );
};
