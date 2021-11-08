/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import getMovie from '../../api/getMovie';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);

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
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
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
              onClick={() => {
                getMovie(query)
                  .then(film => {
                    if (!film.Title) {
                      setError(true);

                      return;
                    }

                    setMovie(film);
                  })
                  .catch(() => {
                    setError(true);
                  });

                setQuery('');
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
