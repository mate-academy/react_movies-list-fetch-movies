import React, { useState } from 'react';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);
  const [preview, setPrewiew] = useState(false);
  const [isAddPossible, setIsAddPossible] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setPrewiew(false);
    setTitle('');

    if (isAddPossible) {
      addMovie(movie);
      setIsAddPossible(false);
    }
  };

  const findMovie = async() => {
    if (!title) {
      setError(true);

      return;
    }

    const foundMovie = await getMovie(title);

    if (foundMovie.Response === 'False') {
      setError(true);
      setPrewiew(false);
      setIsAddPossible(false);

      return;
    }

    setMovie({
      title: foundMovie.Title,
      description: foundMovie.Plot,
      imgUrl: foundMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}/`,
      imdbId: foundMovie.imdbID,
    });

    setError(false);
    setIsAddPossible(true);
    setPrewiew(true);
    setTitle('');
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
              className={classNames('input', {
                'is-danger': error,
              })}
              autoComplete="off"
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

      {preview && (
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
