import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addNewMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');

  const onFindMovie = async() => {
    const result = await getMovie(value);

    setMovie(result);
  };

  const onAddMovie = () => {
    addNewMovie(movie);
    setValue('');
    setMovie('');
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
              className="input is-danger"
              value={value}
              onChange={({ target }) => {
                setValue(target.value);
              }}
            />
          </div>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onAddMovie}

            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie === '' || movie.Error ? (
        <p className="help is-danger">
          {movie.Error
            ? 'Can\'t find a movie with such a title'
            : ''
          }
        </p>
      ) : (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}

    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
