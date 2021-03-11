import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import data from './api/movies.json';

export const App = () => {
  const [movies, setMovies] = useState(data);
  const [duplicatedMovie, setDuplicatedMovie] = useState(false);

  const addMovie = (movie) => {
    const isMoviePresented = movies.some(mov => movie.imdbId === mov.imdbId);

    if (isMoviePresented) {
      setDuplicatedMovie(true);

      return;
    }

    setMovies(prevMovies => ([...prevMovies, movie]));
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
          duplicatedMovie={duplicatedMovie}
          setDuplicatedMovie={setDuplicatedMovie}
        />
      </div>
    </div>
  );
};
