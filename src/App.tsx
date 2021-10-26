import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovie] = useState<Movie[]>([]);

  const addMovie = (movie: Movie): void => {
    if (movies.find(film => film.imdbID === movie.imdbID)) {
      return;
    }

    setMovie(currentMovies => [movie, ...currentMovies]);
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
