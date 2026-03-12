import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((newMovie: Movie) => {
    setMovies(currentMovies => {
      const exists = currentMovies.some(
        movie => movie.imdbId === newMovie.imdbId,
      );

      if (exists) {
        return [...currentMovies];
      }

      return [...currentMovies, newMovie];
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAddMovie={addMovie} />
      </div>
    </div>
  );
};