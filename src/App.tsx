import React, { useState } from 'react';
import './App.scss';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { getMovie } from './api';

import { MovieData } from './types/MovieData';

export const App = () => {
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [query, setQuery] = useState('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    getMovie(query)
      .then(movie => {
        if (movie) {
          setMovieData(movie);
        }
      })
      .catch(error => setErrorMessage(String(error)))
      .finally(() => setLoading(false));
  };

  const addMovie = () => {
    setMovies(prev => {
      if (movieData) {
        if (!prev.find(m => m.imdbID === movieData.imdbID)) {
          return [...prev, movieData];
        }
      }

      return prev;
    });

    setMovieData(null);
    setQuery('');
  };

  // console.log(movieData);

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        <FindMovie
          movieError={errorMessage}
          query={query}
          setQuery={setQuery}
          movieData={movieData}
          loading={loading}
          onSubmit={onSubmit}
          addMovie={addMovie}
          errorMessage={errorMessage}
        />
      </div>
    </div>
  );
};
