import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const handleMovieAdd = useCallback((newMovie: Movie) => {
    setMovies(prevMovies => {
      if (prevMovies.some(({ imdbId }) => imdbId === newMovie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, newMovie];
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={handleMovieAdd} />
      </div>
    </div>
  );
};
