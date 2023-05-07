import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdition = useCallback((newMovie: Movie) => {
    const checkMovie = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (!checkMovie) {
      setMovies(currentMovies => [...currentMovies, newMovie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onMovieAdition={handleMovieAdition} />
      </div>
    </div>
  );
};
