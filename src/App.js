import React, { useState } from 'react';

import data from './api/movies.json';

import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App = () => {
  const [movies, setData] = useState(data);

  const addMovie = (movieToAdd) => {
    if (!movieToAdd) {
      return;
    }

    // eslint-disable-next-line
    for (const movie of movies) {
      if (movie.imdbId === movieToAdd.imdbID) {
        return;
      }
    }

    const newMovie = {
      title: movieToAdd.Title,
      description: movieToAdd.Plot,
      imgUrl: movieToAdd.Poster,
      imdbUrl: 'https://www.imdb.com/title/tt1375666',
      imdbId: movieToAdd.imdbID,
    };

    setData(currentMovies => [...currentMovies, newMovie]);
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
