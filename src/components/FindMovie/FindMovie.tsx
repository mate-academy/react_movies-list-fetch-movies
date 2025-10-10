import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  onAddMovie: () => void;
  onLoading: boolean;
  foundMovie?: Movie | null;
  onError: boolean;
  setError: (value: boolean) => void;
  handleSetQuery: (query: string) => void;
  onMovieSearch: () => void;
}

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
  onLoading,
  foundMovie,
  onError,
  setError,
  handleSetQuery,
  onMovieSearch,
}) => {
  const [inputValue, setInputValue] = useState<string>('');

  const handleInputValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    handleSetQuery(event.target.value);
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onMovieSearch();
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
              value={inputValue}
              className={classNames('input', { 'is-danger': onError })}
              onChange={handleInputValue}
            />
          </div>

          {onError && (
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
              disabled={inputValue.length < 1}
              className={classNames('button', {
                'is-light': inputValue,
                'is-loading': onLoading,
              })}
            >
              {!onLoading && foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddMovie();
                  setInputValue('');
                  handleSetQuery('');
                  setError(false);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
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
