import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import classnames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movies';

export const FindMovie = ({ onAdd, error, setError }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');

  const [loader, setLoading] = useState(false);

  const handleSearch = ({ target }) => {
    setError(false);
    setValue(target.value);
  };

  const searchMovie = () => {
    setLoading(true);
    getMovie(value).then((data) => {
      if (data.Error) {
        setError(true);
        setMovie(null);
        setLoading(false);

        return;
      }

      setMovie(data);
      setLoading(false);
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
              value={value}
              onChange={handleSearch}
              placeholder="Enter a title to search"
              className={classnames('input', { 'is-danger': error })}
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
                classnames('button', 'is-light', { 'is-loading': loader })}
              onClick={searchMovie}
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
                  onAdd(movie);
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
        {movie && (<MovieCard {...movie} loader={loader} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  setError: PropTypes.func.isRequired,
};
