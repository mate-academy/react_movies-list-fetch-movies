import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { PropTypes } from 'prop-types';
import { MovieCard } from '../MovieCard';
import { fetchMovieByTitle } from '../../api/movies';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(false);

  const handleInputChange = (event) => {
    const { value } = event.target;

    setTitle(value.trim());
  };

  const handleClick = () => {
    movie.title && addMovie(movie);
    setTitle('');
    setMovie({});
  };

  const fetchMovie = async() => {
    const movieFromServer = await fetchMovieByTitle(title);

    if (!movieFromServer.title) {
      setError(true);
    } else {
      setError(false);
    }

    setMovie(movieFromServer);
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
              value={title}
              placeholder="Enter a title to search"
              className={(classNames('input', { 'is-danger': error }))}
              onChange={handleInputChange}
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
              onClick={fetchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleClick}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {
        movie.title && (
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
