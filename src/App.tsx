import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((newMovie: Movie) => {
    const movieIsAdded = movies.some(movie => newMovie.imdbId === movie.imdbId);

    if (movieIsAdded) {
      return;
    }

    setMovies(prevMovies => [
      ...prevMovies,
      newMovie,
    ]);
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
