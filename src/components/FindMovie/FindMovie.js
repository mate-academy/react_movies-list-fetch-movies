import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [searchTitle, setSearchTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const addTitle = (event) => {
    const { value } = event.target;

    setSearchTitle(value);
    setError(false);
  };

  const findMovie = async() => {
    const newMovie = await request(searchTitle);

    if (newMovie.Response === 'False') {
      setError(true);
      setSearchTitle('');

      return;
    }

    setMovie(newMovie);
    setError(false);
  };

  const addNewMovie = (event) => {
    event.preventDefault();
    if (!movie) {
      setError(true);

      return;
    }

    setSearchTitle('');
    setMovie(null);
    setError(false);

    addMovie(movie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={addNewMovie}
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
              className={error
                ? 'input is-danger'
                : 'input is-success'
              }
              value={searchTitle}
              onChange={addTitle}
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
              onClick={findMovie}
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

      {!error && (
        <div className="container">
          <h2 className="title">Preview</h2>
          {movie && (<MovieCard movie={movie} />)}
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
