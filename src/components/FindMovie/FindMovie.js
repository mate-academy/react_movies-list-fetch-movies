import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { findMovie } from '../../Api';

export const FindMovie = ({ addNew }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setSingleMovie] = useState(false);
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
              className={classNames('input', {
                'is-danger': movie.Error,
              })}
              value={inputValue}
              onChange={event => setInputValue(event.target.value)}
            />
          </div>
          <p
            className={classNames('help', {
              'is-danger': movie.Error,
            })}
            hidden={movie.Error}
          >
            {movie.Error && <>Can&apos;t find a movie with such a title</>}
          </p>
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
