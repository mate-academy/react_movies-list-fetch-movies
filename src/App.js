import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);

  const addMovieToList = (movie) => {
    if (movies.some(film => film.imdbId === movie.imdbID)) {
      return;
    }

    setMovies([
      ...movies,
      {
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
        imdbId: movie.imdbID,
      },
    ]);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie onAdd={addMovieToList} />
      </div>
    </div>
  );
};
