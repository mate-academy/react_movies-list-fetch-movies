import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App:React.FC = () => {
  const [movies, setMovies] = useState(data);
  const [movieAdded, setMovieAdded] = useState(false);

  const addMovie = (newMovie: Movie) => {
    const foundMovie = movies.find(movie => movie.imdbId === newMovie.imdbId);

    if (!foundMovie) {
      setMovies([newMovie, ...movies]);
      setMovieAdded(false);
    } else {
      setMovieAdded(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
        {movieAdded && (
          <p>Movie is already added</p>
        )}
      </div>
    </div>
  );
};
