import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMoviesList = useCallback((movie: Movie): void => {
    const hasMovie = movies.some(film => film.imdbId === movie.imdbId);

    if (!hasMovie) {
      setMovies([
        ...movies,
        movie,
      ]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleMoviesList} />
      </div>
    </div>
  );
};
