import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onMovieAdd = (movie: Movie) => {
    setMovies(prevMovies => {
      const isMovieExists = prevMovies.some(m => m.imdbId === movie.imdbId);

      if (isMovieExists) {
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
        <FindMovie onMovieAdd={onMovieAdd} />
      </div>
    </div>
  );
};
