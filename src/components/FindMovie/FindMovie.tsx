import React, { FC } from 'react';
import './FindMovie.scss';

import cN from 'classnames';
import { MovieCard } from '../MovieCard';
import { useFindMovie } from './useFindMovie';

export const FindMovie: FC<FindMovieProps> = (props) => {
  const {
    searchInput,
    error,
    saveInputValue,
    handleSearch,
    onBlur,
    handleAddingMovie,
    usedMovieError,
    errorTitle,
    isPreviewReady,
    isFilmAdded,
    title,
    description,
    imgUrl,
    imdbUrl,
    imdbId,
  } = useFindMovie(props);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={searchInput}
              id="movie-title"
              placeholder="Enter a title to search"
              className={cN({
                input: true,
                'is-danger': error,
              })}
              onChange={saveInputValue}
              onBlur={onBlur}
            />
          </div>

          {errorTitle && (
            <p className="help is-danger">
              Please, write a title
            </p>
          )}
          {error && (
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
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddingMovie}
              disabled={!isPreviewReady}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {usedMovieError
      && (
        <div className="adding-error-container">
          <p className="adding-error">
            This film has been already added
          </p>
        </div>
      )}

      {isPreviewReady
      && !isFilmAdded
      && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            title={title}
            description={description}
            imgUrl={imgUrl}
            imdbUrl={imdbUrl}
            imdbId={imdbId}
          />
        </div>
      )}
    </>
  );
};
