// import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import React from 'react';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  query: string
  movie: Movie | null
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  getNewMovie: (e: React.FormEvent) => void
  addNewMovie: () => void
  notFoundMovie: boolean
  finished: boolean
  showErrorMessage: boolean
};

export const FindMovie: React.FC<Props> = (
  {
    query,
    movie,
    handleChange,
    getNewMovie,
    addNewMovie,
    notFoundMovie,
    finished,
    showErrorMessage,
  },
) => {
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
              value={query}
              onChange={handleChange}
            />
          </div>

          {notFoundMovie && query && showErrorMessage && (
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
                'is-loading': !finished,
              })}
              disabled={Boolean(!query.length)}
            >
              Find a movie
            </button>
          </div>

          {Boolean(movie) && (
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

      {movie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
