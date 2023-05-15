import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovie = useCallback((newMovie: Movie) => {
    setMovies(prevMovies => {
      const isMovieInMovies = prevMovies.some(({ imdbId }) => (
        imdbId === newMovie.imdbId));

      return isMovieInMovies
        ? prevMovies
        : [...prevMovies, newMovie];
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie addMovie={handleMovie} />
      </div>
    </div>
  );
};
