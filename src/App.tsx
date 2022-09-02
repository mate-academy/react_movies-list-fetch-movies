/* eslint-disable max-len */
import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onAdd = useCallback((movie: Movie) => {
    setMovies((prevMovies) => {
      if (prevMovies.some(prevMovie => prevMovie.imdbId === movie.imdbId)) {
        return prevMovies;
      }

      return [...prevMovies, movie];
    });
  }, []);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onAdd={onAdd} />
      </div>
    </div>
  );
};
