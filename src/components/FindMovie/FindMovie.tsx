import React, { memo, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { request } from '../../api/films';

import { MovieCard } from '../MovieCard';
import { useMoviesContext } from '../../customHooks/useMoviesContext';

export const FindMovie: React.FC = memo(() => {
  const { movies, setMovies } = useMoviesContext();

  const [hasError, setHasError] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [searchedMovie, setSearchedMovie] = useState<Movie | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setSearchValue(event.target.value);
  };

  const hasMovie = (movie: Movie) => (
    movies.some(({ imdbID }) => imdbID === movie.imdbID)
  );

  const resetForm = () => {
    setSearchValue('');
    setSearchedMovie(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (searchedMovie && !hasMovie(searchedMovie)) {
      setMovies([...movies, searchedMovie]);
    }

    resetForm();
  };

  const getMovie = () => {
    request(searchValue)
      .then(data => {
        if (data.Response === 'True') {
          setSearchedMovie(data);
        } else {
          setHasError(true);
        }
      });
  };

  const isDisabled = () => {
    if (searchedMovie && !hasMovie(searchedMovie)) {
      return false;
    }

    return true;
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': hasError })}
              value={searchValue}
              onChange={handleChange}
            />
          </div>

          {hasError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={isDisabled()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {searchedMovie && (
          <MovieCard movie={searchedMovie} />
        )}
      </div>
    </>
  );
});
