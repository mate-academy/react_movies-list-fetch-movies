import React from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({
  error,
  film,
  addFilm,
  query,
  handleSearch,
  handleChange,
}) => (
  <>
    <form
      className="find-movie"
      onSubmit={(event) => {
        event.preventDefault();
        addFilm(film);
      }}
    >
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            id="movie-title"
            value={query}
            placeholder="Enter a title to search"
            className={`input ${error ? 'is-danger' : ''}`}
            onChange={event => handleChange(event)}
          />
        </div>

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
            type="submit"
            className="button is-primary"
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

    <div className="container">
      <h2 className="title">Preview</h2>
      {!!film && (
        <MovieCard
          title={film.Title}
          description={film.Plot}
          imgUrl={film.Poster}
          imdbUrl={`https://www.imdb.com/title/${film.imdbID}`}
        />
      )}
    </div>
  </>
);

FindMovie.propTypes = {
  error: PropTypes.bool.isRequired,
  film: PropTypes.shape().isRequired,
  addFilm: PropTypes.func.isRequired,
  query: PropTypes.string.isRequired,
  handleSearch: PropTypes.func.isRequired,
  handleChange: PropTypes.func.isRequired,
};
