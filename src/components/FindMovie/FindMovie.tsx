/* eslint-disable no-console */
import React, { useContext } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieContext } from '../../context/movieContext';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = () => {
  const {
    inputValue,
    changeInputValue,
    isLoadingMovie,
    isError,
    searchMovie,
    movie,
    reset,
    addMovie,
  } = useContext(MovieContext);


  const onFormClick = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    searchMovie(inputValue);

    reset();
  };

  return (
    <>
      <form className="find-movie" onSubmit={(event) => onFormClick(event)}>
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
              className={classNames({ input: true, 'is-danger': isError })}
              value={inputValue}
              onChange={(event) => changeInputValue(event.target.value)}
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
              className={classNames({
                'button is-light': !isLoadingMovie,
                'button is-light is-loading': isLoadingMovie,
              })}
              disabled={!inputValue}
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
    </>
  );
};
