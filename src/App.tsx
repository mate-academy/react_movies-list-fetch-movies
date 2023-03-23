import React, { useCallback, useState } from 'react';
import './App.scss';
import debounce from 'lodash.debounce';
import { MoviesList } from './components/MoviesList';
import { FindMovie } from './components/FindMovie';
import { Movie } from './types/Movie';
import { Error, getMovie, NormalizeMovieData } from './api';
import { MovieData } from './types/MovieData';
import { Loader } from './components/Loader/Loader';

export const App: React.FC = () => {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const applyQuery = useCallback(
    debounce(
      setAppliedQuery,
      1000,
    ),
    [appliedQuery],
  );

  const handleSubmit = () => {
    setIsLoading(true);
    getMovie(appliedQuery)
      .then((data) => {
        setMovie(NormalizeMovieData(data as MovieData));
      })
      .catch(() => (
        setErrorMessage(Error.Loading)
      ))
      .finally(() => {
        setIsLoading(false);
      });
  };

  const addMovie = (addedMovie: Movie) => {
    setMovies([
      ...movies,
      addedMovie,
    ]);

    setAppliedQuery('');
    setQuery('');
    setMovie(null);
  };

  return (
    <div className="page">
      <div className="page-content">
        <MoviesList movies={movies} />
      </div>

      <div className="sidebar">
        {isLoading
          ? (<Loader />)
          : (
            <FindMovie
              query={query}
              setQuery={setQuery}
              applyQuery={applyQuery}
              onSubmit={handleSubmit}
              errorMessage={errorMessage}
              movie={movie as Movie}
              addMovie={addMovie}
            />
          )}
      </div>
    </div>
  );
};
