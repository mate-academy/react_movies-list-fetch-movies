import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovies = (movie: Movie) => {
    setMovies(prevMovies => {
      const exists = prevMovies.some(
        prevMovie => prevMovie.imdbId === movie.imdbId,
      );

      if (!exists) {
        return [...prevMovies, movie];
      }

      return prevMovies;
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleMovies} />
      </div>
    </div>
  );
};
