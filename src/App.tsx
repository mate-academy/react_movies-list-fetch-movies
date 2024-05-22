import { useCallback, useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const handleAddMovie = useCallback(
    (movie: Movie) => {
      const newMovie = movies.find(
        currentMovie => currentMovie.imdbId === movie.imdbId,
      );

      if (movies.length === 0 || !newMovie) {
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
        <FindMovie handleAddMovie={handleAddMovie} />
      </div>
    </div>
  );
};
