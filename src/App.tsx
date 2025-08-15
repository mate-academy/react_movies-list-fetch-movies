import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-shadow
  const onAddMovie = (movie: Movie) => {
    if (!movies.some(m => m.imdbId === movie.imdbId)) {
      setMovies(prevMovies => [...prevMovies, movie]);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie movies={movies} onAddMovie={onAddMovie} />
      </div>
    </div>
  );
};
