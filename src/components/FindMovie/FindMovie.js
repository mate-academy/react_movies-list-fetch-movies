import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movies';

export const FindMovie = ({ addMovie, setError, error }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState('');

  const handleSearch = ({ target }) => {
    setError(false);
    setQuery(target.value);
  };

  const searchBtnHandler = () => {
    getMovie(query).then((data) => {
      if (data.Error) {
        setError(true);
        setMovie(null);

        return;
      }

      setMovie(data);
    });
  };

  const addBtnHandler = () => {
    if (movie) {
      addMovie(movie);
      setMovie('');
      setQuery('');
    }
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
              className={classNames({
                input: true,
                'is-danger': error,
              })}
              value={query}
              onChange={handleSearch}
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
              onClick={searchBtnHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addBtnHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        {movie && (
          <MovieCard {...movie} />
        )}

      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
  setError: PropTypes.func.isRequired,
};
