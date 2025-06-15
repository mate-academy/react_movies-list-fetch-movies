import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const handleAddMovie = (movie: Movie) => {
    setMovies(prev => {
      if (prev.some(m => m.imdbId === movie.imdbId)) {
        return prev;
      }

      return [...prev, movie];
    });
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          setError={setError}
          error={error}
          onAddMovie={handleAddMovie}
        />
      </div>
    </div>
  );
};
