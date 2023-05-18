import { useState, useCallback } from 'react';
import './App.scss';
import { FindMovie } from './components/FindMovie';
import { MoviesList } from './components/MoviesList';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleSetMovies = useCallback((movie: Movie) => {
    setMovies((prevMovies) => [...prevMovies, movie]);
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          onAddToList={handleSetMovies}
        />
      </div>
    </div>
  );
};
