/* eslint-disable @typescript-eslint/no-unused-vars */
// #region imports
import { useState } from 'react';
import './App.scss';

import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
// #endregion

export const App = () => {
  // #region useState
  const [query, setQuery] = useState<string>('');
  const [hasQueryErrorMessage, setHasQueryErrorMessage] = useState<string>('');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);

  const [loading, setLoading] = useState<boolean>(false);
  // #endregion

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          query={query}
          setQuery={setQuery}
          currentMovie={currentMovie}
          setCurrentMovie={setCurrentMovie}
          hasQueryErrorMessage={hasQueryErrorMessage}
          setHasQueryErrorMessage={setHasQueryErrorMessage}
          movies={movies}
          setMovies={setMovies}
          loading={loading}
          setLoading={setLoading}
        />
      </div>
    </div>
  );
};
