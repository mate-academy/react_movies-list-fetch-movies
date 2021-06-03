import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState({});
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const handleChange = ({ target }) => {
    setMovie({});
    setTitle(target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (Object.keys(movie).includes('title')) {
      addMovie(movie);
      setMovie({});
      setTitle('');
    }
  };

  const findMovie = async() => {
    const foundMovie = await getMovie(title);

    if (Object.keys(foundMovie).includes('Title')) {
      setMovie({
        title: foundMovie.Title,
        description: foundMovie.Plot,
        imgUrl: foundMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
        imdbId: foundMovie.imdbID,
      });

      return;
    }

    setError(true);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={title}
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
              onClick={findMovie}
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

      {Object.keys(movie).includes('title') && (
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
