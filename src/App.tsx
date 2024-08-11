import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  function onAddMovies(movie: Movie) {
    if (!movies.some(currentMovie => currentMovie.imdbId === movie.imdbId)) {
      setMovies(prevMovie => {
        return [...prevMovie, movie];
      });
    }
  }

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie movie={onAddMovies} />
      </div>
    </div>
  );
};
