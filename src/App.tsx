import { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    if (movies.every(movi => movi.imdbID !== movie.imdbID)) {
      setMovies(currentMovies => [...currentMovies, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie allMovie={movies} onAddMovie={addMovie} />
      </div>
    </div>
  );
};
