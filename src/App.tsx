import React, { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMovieAdd = useCallback((movie: Movie) => {
    if (movies.some(savedMovie => movie.imdbId === savedMovie.imdbId)) {
      return;
    }

    setMovies((prev) => [...prev, movie]);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onAdd={onMovieAdd}
        />
      </div>
    </div>
  );
};
