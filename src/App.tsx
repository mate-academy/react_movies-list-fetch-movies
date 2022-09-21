import { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';

export const App = () => {
  const [movies] = useState<Movie[]>([]);
  const [query, setQuery] = useState<string>('');

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie query={query} setQuery={setQuery} />
      </div>
    </div>
  );
};
