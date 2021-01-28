import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import ClassNames from 'classnames';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setNewMovie] = useState({});
  const [previewVisible, setPreviewVisible] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);

  function fetchMovie() {
    return getMovie(query)
      .then((result) => {
        if (result.Response === 'False') {
          setErrorVisible(true);
        } else {
          setNewMovie(result);
          setPreviewVisible(true);
          setQuery('');
        }
      });
  }

  const handleChange = (e) => {
    setQuery(e.target.value);
    setErrorVisible(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addMovie(newMovie);
    setPreviewVisible(false);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={ClassNames('input', { 'is-danger': errorVisible })}
              value={query}
              onChange={handleChange}
            />
          </div>
          {errorVisible && (
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
              onClick={fetchMovie}
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
      {previewVisible && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
