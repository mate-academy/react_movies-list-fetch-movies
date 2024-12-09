import { useState, useCallback } from 'react';
import './App.scss';
import MoviesList from './components/MoviesList';
import FindMovie from './components/FindMovie';
import { Movie } from './types/Movie';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);

  const onHandleAdd = useCallback(
    (movie: Movie) => {
      const isDuplicateMovie = movies.find(
        existMovie => existMovie.title === movie?.title,
      );

      if (movie && !isDuplicateMovie) {
        setMovies(prevMovies => [...prevMovies, movie]);
      }
    },
    [movies],
  );

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie onHandleAdd={onHandleAdd} />
      </div>
    </div>
  );
};
