import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [inputValue, setValue] = useState('');
  const [movie, setMovie] = useState('');

  const fetchMovie = async() => {
    const res = await getMovies(inputValue);

    setMovie(res);
  };

  const addFindedMovie = (e) => {
    e.preventDefault();

    addMovie(movie);
    setValue('');
    setMovie('');
  };

  return (
    <>
      <form
        className="find-movie"
        action=""
        method="GET"
        onSubmit={addFindedMovie}
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
              className={classNames('input', { 'is-danger': movie.Error })}
              value={inputValue}
              onChange={e => setValue(e.target.value)}
            />
          </div>
          {
            movie.Error
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          movie
            ? !movie.Error && <MovieCard {...movie} />
            : <i>Input movie above*</i>
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
