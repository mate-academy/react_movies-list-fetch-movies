/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';

import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { getMovie } from './api';
// import { normalizeMovieData } from './_utils/normalizeMovieData';
import { isResponseError } from './_utils/isResponseError';

export const App: React.FC = () => {
  console.log('rendering App');

  const [movies] = useState<Movie[]>([]);
  const [currentSearchTerm, setSearchTerm] = useState<string>('');
  // const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isError, setError] = useState<boolean>(false);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };

  const handleFind = () => {
    console.log('searching with term', currentSearchTerm);
    getMovie(currentSearchTerm)
      .then(movieData => {
        if (isResponseError(movieData)) {
          setError(true);
        } else {
          setError(false);
          console.log('movie data in app', movieData);
          // ... handle movie data
        }
      })
      .catch(error => {
        setError(true);
        console.log(error);
      });
  };

  useEffect(() => {
    console.log(currentSearchTerm, 'currentSearch');
  }, [currentSearchTerm]);

  useEffect(() => {
    console.log('Error', isError);
  }, [isError]);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          onSearch={handleSearch}
          onFind={handleFind}
          isError={isError}
        // onAdd={handleAddMovie}
        />
      </div>
    </div>
  );
};
