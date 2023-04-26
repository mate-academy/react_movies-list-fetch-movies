import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  query: string,
  onChangeQuery(value: string): void,
  onSubmit(value: string): void,
  selectedMovie: Movie | null,
  isLoading: boolean,
  hasError: boolean,
  canAddMovie: boolean,
  onAdd(): void,
};

export const FindMovie: React.FC<Props> = ({
  query,
  onChangeQuery,
  onSubmit,
  selectedMovie,
  isLoading,
  hasError,
  canAddMovie,
  onAdd,
}) => {
  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(query);
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
              className="input is-dander"
              value={query}
              onChange={(e) => onChangeQuery(e.target.value)}
            />
          </div>

          {hasError && (
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
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          {canAddMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAdd}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {selectedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
            <MovieCard movie={selectedMovie} />
        </div>
      )}
    </>
  );
};
