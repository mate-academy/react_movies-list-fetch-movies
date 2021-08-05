import React, { useState } from 'react';
import PropTypes from 'prop-types';
import cn from 'classnames';

import './FindMovie.scss';

import { request } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [movieTitleInput, setMovieTitleInput] = useState('');
  const [error, setError] = useState(false);

  const findMovie = (movieTitle) => {
    request(movieTitle)
      .then((response) => {
        if (response.Response === 'False') {
          setError(true);

          return;
        }

        setError(false);
        setMovie(response);
      });
  };

  const handleChange = (event) => {
    setError(false);
    setMovieTitleInput(event.target.value);
  };

  const handleMovieAddition = () => {
    addMovie(movie, setMovie);
    setMovieTitleInput('');
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
              className={cn({
                input: true,
                'is-danger': error,
              })}
              value={movieTitleInput}
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
              className="button is-light"
              onClick={() => findMovie(movieTitleInput)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleMovieAddition}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && !error && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
