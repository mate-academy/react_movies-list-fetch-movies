import React, { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleAddMovie = useCallback((newMovie: Movie) => {
    const movieAlreadyExist = movies
      .some(movie => movie.imdbId === newMovie.imdbId);

    if (!movieAlreadyExist) {
      setMovies(prevMovies => [...prevMovies, newMovie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        {movies && <MoviesList movies={movies} />}
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleAddMovie} />
      </div>
    </div>
  );
};
