import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const findId = (prevMovie, movie) => prevMovie
    .every(item => item.imdbID !== movie.imdbID) && movie.imdbID;

  const addNewMovie = (movie) => {
    setMovies((prevMovie) => {
      if (findId(prevMovie, movie)) {
        return [...prevMovie, movie];
      }

      return prevMovie;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addNewMovie={addNewMovie} />
      </div>
    </div>
  );
};
