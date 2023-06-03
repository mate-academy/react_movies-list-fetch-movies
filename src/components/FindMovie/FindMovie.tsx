import React, { useEffect } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  movie: Movie | null;
  isSubmitted: boolean;
  showError: boolean;
  setShowError: (showError: boolean) => void;
  handleAdd: () => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export const FindMovie: React.FC<Props> = ({
  query, setQuery, movie, isSubmitted, showError,
  setShowError, handleAdd, handleSubmit,

}) => {
  useEffect(() => {
    if (query) {
      setShowError(false);
    }
  }, [query]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {showError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames({
                'button is-light': !isSubmitted,
                'button is-light is-loading': isSubmitted,
              })}
              disabled={!query.length}
            >
              {!movie ? 'Find a movie' : 'Search again'}
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
