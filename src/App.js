import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setMovies] = useState([]);

  const addMovie = (newMovie) => {
    setMovies((prevList) => {
      const isInList = prevList
        .every(prevMovie => prevMovie.imdbID !== newMovie.imdbID);

      if (isInList && newMovie.imdbID) {
        return [...prevList, newMovie];
      }

      return prevList;
    });
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
