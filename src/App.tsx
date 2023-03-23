import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { Error, getMovie, NormalizeMovieData } from './api';
import { MovieData } from './types/MovieData';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ),
    [appliedQuery],
  );

  const handleSubmit = () => {
    getMovie(appliedQuery)
      .then((data) => {
        setMovie(NormalizeMovieData(data as MovieData));
      })
      .catch(() => (
        setErrorMessage(Error.Loading)
      ))
      .finally(() => {
        setAppliedQuery('');
        setQuery('');
      });
  };

  const addMovie = (addedMovie: Movie) => {
    setMovies([
      ...movies,
      addedMovie,
    ]);
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
          applyQuery={applyQuery}
          onSubmit={handleSubmit}
          errorMessage={errorMessage}
          movie={movie as Movie}
          addMovie={addMovie}
        />
      </div>
    </div>
  );
};
