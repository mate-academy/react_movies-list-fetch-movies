import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, addMovies] = useState<Movie[]>([]);

  const addMovie = (movie: Movie | null) => {
    if (movie === null) {
      return;
    }

    const existMovie = movies.find((mov) => mov.imdbID === movie.imdbID);

    if (!existMovie) {
      addMovies(currentMovie => [
        ...currentMovie,
        movie,
      ]);
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
