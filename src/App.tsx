import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAddMovie = (movie: Movie) =>
    setMovies(prevMovies => {
      const control = prevMovies.some(
        prevMovie => prevMovie.imdbId === movie.imdbId,
      );

      if (control) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={onAddMovie} />
      </div>
    </div>
  );
};
