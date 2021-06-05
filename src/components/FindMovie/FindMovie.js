import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { request } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [searchField, setSearchField] = useState('');
  const [searchFieldError, setsearchFieldError] = useState(false);
  const [movieFromServer, setMovieFromServer] = useState(null);

  const findMovie = (movie) => {
    request(movie)
      .then((result) => {
        if (result.Response !== 'False') {
          return setMovieFromServer(result);
        }

        return Promise.reject(result.Error);
      })
      .catch(() => {
        setsearchFieldError(true);
      });
  };

  return (
    <>
      <form
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': searchFieldError })}
              value={searchField}
              onChange={(event) => {
                setSearchField(event.target.value);
                setsearchFieldError(false);
              }}
            />
          </div>

          {searchFieldError
        && (
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
              onClick={() => findMovie(searchField)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movieFromServer);
                setSearchField('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movieFromServer
    && (
    <div className="container">
      <h2 className="title">Preview</h2>
      <MovieCard
        title={movieFromServer.Title}
        description={movieFromServer.Plot}
        imgUrl={movieFromServer.Poster}
      />
    </div>
    )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
