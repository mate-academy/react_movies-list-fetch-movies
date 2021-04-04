import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

const getMovies = name => getMovie(name);

export const FindMovie = ({ setMovie }) => {
  const [value, setInput] = useState('');
  const [preview, setPreview] = useState({});
  const [error, setError] = useState(null);
  const isNormalPreview = !!Object.keys(preview).length;

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
              value={value}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={(event) => {
                setInput(event.target.value);
              }}
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
              onClick={async() => {
                const movieFromServer = await getMovies(value);

                if (movieFromServer.Response === 'False') {
                  setError(true);

                  return;
                }

                setError(null);
                setPreview(movieFromServer);
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
                if (isNormalPreview) {
                  setMovie((array) => {
                    const hasThisMovie = array.some(
                      elem => (elem.imdbId || elem.imdbID) === preview.imdbID,
                    );

                    if (hasThisMovie) {
                      return array;
                    }

                    return [...array, preview];
                  });
                  setPreview({});
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {isNormalPreview && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...preview} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setMovie: PropTypes.func.isRequired,
};
