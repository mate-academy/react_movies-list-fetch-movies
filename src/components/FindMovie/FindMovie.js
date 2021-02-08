import React, { useState } from 'react';
import './FindMovie.scss';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/getMovies';

export const FindMovie = ({ addMovie, error, setError }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState(null);

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
              className={ClassNames({
                input: true,
                'is-danger': error === 'Cant find a movie',
              })}
              value={value}
              onChange={
                ((event) => {
                  setValue(event.target.value);
                })
              }
            />
          </div>

          {error
            && (
              <p className="help is-danger">
                {error}
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                getMovie(value)
                  .then((result) => {
                    if (result.Error) {
                      setError('Cant find a movie');

                      return;
                    }

                    setMovie(result);
                  });
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
                addMovie(movie);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {(movie
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </div>
        ))}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  error: PropTypes.string.isRequired,
  setError: PropTypes.func.isRequired,
};
