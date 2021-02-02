import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [enteredName, setMovieSearch] = useState('');
  const [foundMovie, setMovie] = useState(null);
  const [isCorrect, setAvailability] = useState(true);

  const movieRequest = async() => {
    try {
      const result = await getMovie(enteredName);

      if (enteredName.trim() && !result.Error) {
        setAvailability(true);
        setMovie(result);

        return;
      }

      setAvailability(false);
    } catch (error) {
      throw error;
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => e.preventDefault()}
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
              className={classNames('input', {
                'is-danger': (!isCorrect && !foundMovie),
              })}
              value={enteredName}
              onChange={(event) => {
                setMovieSearch(event.target.value);
                setAvailability(true);
              }}
            />
          </div>

          {(!isCorrect && !foundMovie)
            && (
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
              onClick={result => movieRequest(result)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(foundMovie);
                setMovieSearch('');
                setMovie(null);
              }}
              disabled={!isCorrect}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {(isCorrect && foundMovie)
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...foundMovie} />
          </div>
        )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
