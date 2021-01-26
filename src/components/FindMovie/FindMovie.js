import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ moviesAdder }) => {
  const [title, setTitle] = useState('');
  const [movieErr, setErr] = useState(false);
  const [foundMovie, setMovie] = useState({});
  const [showPreview, setPreview] = useState(false);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          moviesAdder({ ...foundMovie });
          setMovie({});
          setPreview(false);
          setTitle('');
        }}
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
              className="input is-danger"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErr(false);
                setPreview(false);
              }}
            />
          </div>
          {movieErr && (
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
              onClick={async() => {
                const queryResult = await getMovie(title);

                // eslint-disable-next-line no-prototype-builtins
                if (queryResult.hasOwnProperty('Error')) {
                  setErr(true);
                } else {
                  setMovie({ ...queryResult });
                  setPreview(true);
                }
              }}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!showPreview}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        {showPreview && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...foundMovie} />
          </>
        ) }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  moviesAdder: PropTypes.func.isRequired,
};
