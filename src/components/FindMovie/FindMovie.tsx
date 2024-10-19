import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onQueryChange: (query: string) => void;
  isError: boolean;
  isErrorChange: (isError: boolean) => void;
  preview: Movie | null;
  onAddMovie: (movie: Movie) => void;
  formReset: () => void;
  isLoading: boolean;
};

export const FindMovie: React.FC<Props> = ({
  onQueryChange,
  isError,
  isErrorChange,
  preview,
  onAddMovie,
  formReset,
  isLoading,
}) => {
  const [currentQuery, setCurrentQuery] = useState('');

  const onHandleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    isErrorChange(false);
    setCurrentQuery(e.target.value);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!currentQuery.trim()) {
      return;
    }

    onQueryChange(currentQuery);
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
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isError })}
              value={currentQuery}
              onChange={onHandleInput}
            />
          </div>

          {isError && (
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!currentQuery.trim()}
            >
              {isLoading ? 'Loading...' : 'Find a movie'}
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  formReset();

                  return onAddMovie(preview!);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
