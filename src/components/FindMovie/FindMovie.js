import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { findMovie } from '../../Api';

export const FindMovie = ({ addNew }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setSingleMovie] = useState(null);
  const add = async movieName => setSingleMovie(await findMovie(movieName));

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
              className="input is-danger"
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
            />
          </div>

          {movie !== null && movie.Title !== null ? (
            <p
              className="help is-danger"
            >
              Can&apos;t find a movie with such a title
            </p>
          ) : ''}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => add(inputValue)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addNew(movie)}
            >
              Add to the list

            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && !movie.Error ? (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        ) : ''}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNew: PropTypes.func.isRequired,
};
