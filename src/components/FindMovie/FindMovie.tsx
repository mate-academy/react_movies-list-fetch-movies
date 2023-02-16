import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { getMovieFromData } from '../../utils';
import { ErrorMessage } from '../../types/ErrorMessage';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [errorMessage, setErrorMessage] = useState(ErrorMessage.NONE);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const reset = useCallback(() => {
    setMovie(null);
    setQuery('');
    setHasError(false);
  }, []);

  const showError = useCallback((error: ErrorMessage) => {
    setHasError(true);
    setErrorMessage(error);
  }, []);

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSearching(true);

    try {
      const movieData = await getMovie(query);

      if ('Error' in movieData) {
        showError(ErrorMessage.NO_MOVIE);

        return;
      }

      setMovie(
        getMovieFromData(movieData),
      );
    } catch {
      showError(ErrorMessage.UNEXPECTED);
    } finally {
      setIsSearching(false);
    }
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setHasError(false);
    }, [],
  );

  const handleAdd = useCallback(() => {
    if (movie) {
      addMovie(movie);
      reset();
    }
  }, [movie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={handleChange}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                { 'is-loading': isSearching },
              )}
              disabled={!query}
            >
              {
                movie
                  ? 'Search again'
                  : 'Find a movie'
              }
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
