import { useEffect, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  useEffect(() => {
    if (foundMovie && movies.every(
      movie => foundMovie.imdbId !== movie.imdbId,
    )) {
      setMovies([...movies, foundMovie]);
    }
  }, [foundMovie]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setFoundMovie={setFoundMovie}
        />
      </div>
    </div>
  );
};
