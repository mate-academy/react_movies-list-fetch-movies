// import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import React from 'react';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  hasQuery: string
  movie: Movie | null
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  getNewMovie: (e: React.FormEvent) => void
  addNewMovie: () => void
  isFoundMovie: boolean
  isLoading: boolean
  isErrorMessage: boolean
};

export const FindMovie: React.FC<Props> = ({
  hasQuery,
  movie,
  handleChange,
  getNewMovie,
  addNewMovie,
  isFoundMovie,
  isLoading,
  isErrorMessage,
}) => {
  const searchButton = movie
    ? 'Search again'
    : 'Find a movie';

  return (
    <>
      <form className="find-movie" onSubmit={getNewMovie}>
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
              value={hasQuery}
              onChange={handleChange}
            />
          </div>

          {!isFoundMovie && hasQuery && isErrorMessage && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!hasQuery.length}
            >
              {searchButton}
            </button>
          </div>

          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
