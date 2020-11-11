import React, { useState } from 'react';

import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = () => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(false);

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
              className={
                classNames('input', {
                  'is-danger': error,
                })
              }
              value={query}
              onChange={event => setQuery(event.target.value)}
              onFocus={() => setError(false)}
            />
          </div>
          {!error ? null
            : (
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
              onClick={() => {
                getMovie(query).then((movieFromServer) => {
                  setMovie(movieFromServer);
                  setError(movieFromServer.Title === undefined);
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
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!movie.Title ? null
          : (
            <MovieCard
              title={movie.Title}
              description={movie.Plot}
              imgUrl={movie.Poster}
              imdbUrl={`https://www.imdb.com/title/${movie.imdbID}`}
            />
          )
        }
      </div>
    </>
  );
};
