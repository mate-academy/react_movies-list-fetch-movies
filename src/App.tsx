import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMoviesChange = (movie: Movie) => {
    setMovies(currentMovies => {
      const existingMovie = currentMovies.find(
        existing => existing.imdbId === movie.imdbId,
      );

      return existingMovie ? currentMovies : [...currentMovies, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMoviesChange={onMoviesChange} />
      </div>
    </div>
  );
};
