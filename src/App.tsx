import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { useState } from 'react';

export const App = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | undefined>();
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movies={movies}
          query={query}
          setQuery={setQuery}
          setMovies={setMovies}
          currentMovie={currentMovie}
          setCurrentMovie={setCurrentMovie}
          error={error}
          setError={setError}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};
