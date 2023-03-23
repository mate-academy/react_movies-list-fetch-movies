import classNames from 'classnames';
import React, { useEffect, useRef } from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type FindMovieProps = {
  query: string
  setQuery: (event: string) => void,
  applyQuery: (event: string) => void,
  onSubmit: () => void,
  errorMessage: boolean,
  movie: Movie,
  addMovie: (movie: Movie) => void,
  setErrorMessage: (boolean: boolean) => void,
  isLoading: boolean,
};

export const FindMovie: React.FC<FindMovieProps> = ({
  query,
  setQuery,
  applyQuery,
  onSubmit,
  errorMessage,
  movie,
  addMovie,
  setErrorMessage,
  isLoading,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
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
              className={classNames(
                'input',
                { 'is-dander': errorMessage },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                applyQuery(event.target.value);
                setErrorMessage(false);
              }}
              ref={inputRef}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={onSubmit}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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

      {errorMessage && (
        <p className="help is-danger" data-cy="errorMessage">
          Can&apos;t find a movie with such a title
        </p>
      )}
    </>
  );
};
