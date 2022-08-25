import { useCallback, useMemo, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const moviesId = useMemo(() => {
    return movies.map(movie => movie.imdbId);
  }, [movies]);

  const onAdd = useCallback((movie: Movie) => {
    setMovies((prev) => [...prev, movie]);
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={onAdd} moviesId={moviesId} />
      </div>
    </div>
  );
};
