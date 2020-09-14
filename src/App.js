import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import moviesfromServer from './api/movies.json';

export const App = () => {
  const [movies, setMovie] = useState(moviesfromServer);

  const addMovie = (movie) => {
    if (!movies.find(film => film.imdbId === movie.imdbID)) {
      setMovie(
        [
          ...movies,
          {
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster,
            imdbId: movie.imdbID,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
          },
        ],
      );
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          onAdd={addMovie}
        />
      </div>
    </div>
  );
};
