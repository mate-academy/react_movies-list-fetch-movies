import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export const FindMovie = ({
  onSearchField,
  toFindMovie,
  addMovie,
  query,
  isError,
  newMovie,
}) => (
  <>
    <form className="find-movie">
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            className={classNames('input',
              { 'is-danger': isError })}
            value={query}
            onChange={e => onSearchField(e)}
          />
        </div>

        <p className={classNames('help',
          { 'is-danger': isError },
          { 'is-reveal': isError })}
        >
          Can&apos;t find a movie with such a title
        </p>
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="button"
            className="button is-light"
            onClick={toFindMovie}
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            type="button"
            className="button is-primary"
            onClick={addMovie}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

    {newMovie
      && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )
    }
  </>
);

FindMovie.propTypes = {
  onSearchField: PropTypes.func.isRequired,
  toFindMovie: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  isError: PropTypes.bool.isRequired,
  newMovie: PropTypes.shape({}),
};

FindMovie.defaultProps = {
  newMovie: null,
};
