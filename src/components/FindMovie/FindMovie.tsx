import React, { FormEvent, useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onSubmit: (event: FormEvent) => void;
  onInputChange: (value: string) => void;
  queryValue: string;
  isLoading: boolean;
  isNotFound: boolean;
  setIsNotFound: (value: boolean) => void;
  foundMovie: Movie | null,
  addNewMovie: () => void;
}

export const FindMovie: React.FC<Props> = ({
  onSubmit,
  onInputChange,
  queryValue,
  isLoading,
  isNotFound,
  setIsNotFound,
  foundMovie,
  addNewMovie,
}) => {
  const [hasTitleError, setHasTitleError] = useState(false);
  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onInputChange(event.target.value);
    setHasTitleError(false);

    if (isNotFound) {
      setIsNotFound(false);
    }
  };

  const onTitleBlur = () => {
    if (!queryValue) {
      setHasTitleError(true);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={queryValue}
              onChange={onQueryChange}
              onBlur={onTitleBlur}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': hasTitleError,
              })}
            />
            {hasTitleError && (
              <p className="help is-danger">
                Title is required
              </p>
            )}
          </div>

          {isNotFound && (
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
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={queryValue.trim().length === 0}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addNewMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
