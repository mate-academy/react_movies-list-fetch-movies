import React, { useState } from 'react';
import ClassNames from 'classnames';

import { findMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  movieSaver: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ movieSaver }) => {
  const [input, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={input}
                placeholder="Enter a title to search"
                className={ClassNames('input', { 'is-danger': error })}
                onChange={event => {
                  setError(false);
                  setQuery(event.currentTarget.value);
                }}
              />
            </div>
          </label>

          <p
            className="help is-danger"
            style={
              {
                visibility: error
                  ? 'visible'
                  : 'hidden',
              }
            }
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={async () => {
                await findMovie(input)
                  .then(mov => setMovie(mov))
                  .catch(() => setError(true));
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                if (movie !== null) {
                  movieSaver(movie);
                  setQuery('');
                  setMovie(null);
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
