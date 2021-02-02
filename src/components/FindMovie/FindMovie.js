import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ onAddMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');
  const [error, setError] = useState(false);
  const [loader, setLoader] = useState(false);

  const handleChange = (event) => {
    setError(false);
    setValue(event.target.value);
  };

  const handleSearch = () => {
    setLoader(true);

    getMovie(value).then((data) => {
      if (data.Error) {
        setError(true);
        setMovie(null);
        setLoader(false);

        return;
      }

      setMovie(data);
      setLoader(false);
    });
  };

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
              className={classnames('input', { 'is-danger': error })}
              value={value}
              onChange={handleChange}
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
              className={
                classnames('button', 'is-light', { 'is-loading': loader })
              }
              onClick={handleSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  onAddMovie(movie);
                  setMovie('');
                  setValue('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard {...movie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
