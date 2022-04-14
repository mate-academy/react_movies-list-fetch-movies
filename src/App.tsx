import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const addMovie = useCallback((movie: Movie) => {
    setMovies(prevMovies => {
      if (!prevMovies.some(stateMovie => stateMovie.imdbID === movie.imdbID)) {
        return [...prevMovies, movie];
      }

      return prevMovies;
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>
      <div className="sidebar">
        <FindMovie addMovie={addMovie} />
      </div>
    </div>
  );
};
