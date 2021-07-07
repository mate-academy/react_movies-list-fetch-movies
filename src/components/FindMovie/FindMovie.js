import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/getMovie';

export const FindMovie = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [inputError, setInputError] = useState(false);
  const [movieFound, setMovieFound] = useState(null);

  const clearState = () => {
    setQuery('');
    setMovieFound(null);
    setInputError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => event.preventDefault()}
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
              className={classNames({
                input: true,
                'is-danger': inputError,
              })}
              value={query}
              onChange={({ target }) => {
                setQuery(target.value.trimLeft());
                setInputError(false);
              }}
            />
          </div>

          <p className={classNames({
            error_message: !inputError,
            help: true,
            'is-danger': true,
          })}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              onClick={() => {
                if (!query) {
                  return;
                }

                getMovie(query)
                  .then((result) => {
                    if (result.Response === 'False') {
                      clearState();
                      setInputError(true);

                      return;
                    }

                    setMovieFound({
                      title: result.Title,
                      description: result.Plot,
                      imgUrl: result.Poster,
                      imdbId: result.imdbID,
                    });
                  });
              }

              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (!movieFound) {
                  return;
                }

                clearState();

                onAdd(movieFound);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {!movieFound || (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movieFound} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
