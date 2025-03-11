import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const handleMovie = (movie: Movie) => {
    setMovie(prevMovies => {
      const isMovieExist = prevMovies.some(
        existingMovie => existingMovie.imdbId === movie.imdbId,
      );

      if (isMovieExist) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={handleMovie} />
      </div>
    </div>
  );
};
