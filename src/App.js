import React, { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  useEffect(() => {
    setMovies(data);
  }, []);

  const addMovie = (newMovie) => {
    if (!movies.some(oldMovie => oldMovie.imdbId === newMovie.imdbId)) {
      setMovies([...movies, newMovie]);
    } else {
      window.alert('movie exists already');
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

// here is my key
// 86a74c7
