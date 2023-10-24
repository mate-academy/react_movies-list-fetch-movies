import React, { useState } from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
import { normalizeMovieData } from './_utils/normalizeMovieData';
import { isResponseError } from './_utils/isResponseError';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentSearchTerm, setSearchTerm] = useState<string>('');
  const [currentSearchCount, setSearchCount] = useState(0);
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState<boolean>(false);
  const [isLoading, setLoading] = useState(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFind = () => {
    setLoading(true);
    setSearchCount(prevCount => prevCount + 1);
    getMovie(currentSearchTerm)
      .then(movieData => {
        if (isResponseError(movieData)) {
          setError(true);
        } else {
          setError(false);
          const normalizedMovie = normalizeMovieData(movieData);

          setCurrentMovie(normalizedMovie);
          setLoading(false);
          // ... handle movie data
        }
      })
      .catch(() => {
        setError(true);
      });
  };

  const handleAddMovie = () => {
    if (currentMovie !== null) {
      const isAlreadyAdded = movies.some(
        movie => movie.imdbId === currentMovie.imdbId,
      );

      if (!isAlreadyAdded) {
        setMovies(prevMovies => [...prevMovies, currentMovie]);
      }

      setCurrentMovie(null);
    } else {
      setError(true);
    }
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSearch={handleSearch}
          currentSearchTerm={currentSearchTerm}
          currentSearchCount={currentSearchCount}
          onFind={handleFind}
          onAddMovie={handleAddMovie}
          movie={currentMovie}
          isLoading={isLoading}
          isError={isError}
        />
      </div>
    </div>
  );
};
