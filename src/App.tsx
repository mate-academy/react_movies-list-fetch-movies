import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [query, setQuery] = useState('');
  const [findMovie, setFindMovie] = useState<MovieData | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          setFindMovie={setFindMovie}
          setQuery={setQuery}
          query={query}
          movie={findMovie}
          setHasError={setHasError}
          hasError={hasError}
          setMovies={setMovies}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      </div>
    </div>
  );
};
