import { useState, useCallback } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const addMovies = useCallback((movie: Movie) => {
    const duplicate = movies.find(({ imdbID }) => imdbID === movie.imdbID);

    if (!duplicate) {
      setMovies((state) => [...state, movie]);
    }
  }, [movies]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovies={addMovies} />
      </div>
    </div>
  );
};
