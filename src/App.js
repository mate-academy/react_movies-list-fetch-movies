import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const dataStart = data.map(movie => ({
    Title: movie.title,
    Plot: movie.description,
    Poster: movie.imgUrl,
    imdbID: movie.imdbUrl,
  }));

  const [movies, setMovies] = useState(dataStart);

  const addNewMovie = (movieNew) => {
    if (movies.find(movie => movie.imdbID === movieNew.imdbID)) {
      return;
    }

    setMovies(current => [...current, movieNew]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addNewMovie}
        />
      </div>
    </div>
  );
};
