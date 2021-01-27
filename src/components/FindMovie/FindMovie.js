import React, { useState } from 'react';
import './FindMovie.scss';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ clearInput,
  addMovie,
  findMovie,
  searchedMovie,
  found }) => {
  const [query, setValue] = useState('');

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
              id="movie-title"
              placeholder="Enter a title to search"
              className={ClassNames('input', { 'is-danger': !found })}
              value={query}
              onChange={(e) => {
                setValue(e.target.value);
                clearInput();
              }}
            />
          </div>

          {found || (
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
              onClick={() => {
                findMovie(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie();
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {searchedMovie && <MovieCard {...searchedMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  clearInput: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired,
  findMovie: PropTypes.func.isRequired,
  searchedMovie: PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
  }),
  found: PropTypes.bool.isRequired,
};
FindMovie.defaultProps = {
  searchedMovie: {},
};
