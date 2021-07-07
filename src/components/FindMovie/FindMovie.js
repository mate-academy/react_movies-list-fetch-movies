import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ adder }) => {
  const [query, setQuery] = useState('');
  const [wrongInput, setWrongInput] = useState(false);
  const [movieFound, setMovieFound] = useState(null);

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
                'is-danger': wrongInput,
              })}
              value={query}
              onChange={({ target }) => {
                setQuery(target.value.trimLeft());
                setWrongInput(false);
              }}
            />
          </div>

          <p className={classNames({
            error: !wrongInput,
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
              type="button"
              className="button is-light"
              onClick={() => {
                if (!query) {
                  return;
                }

                getMovie(query)
                  .then((result) => {
                    if (result.Response === 'False') {
                      setQuery('');
                      setMovieFound(null);
                      setWrongInput(false);
                      setWrongInput(true);

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

                setQuery('');
                setMovieFound(null);
                setWrongInput(false);
                adder(movieFound);
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
  adder: PropTypes.func.isRequired,
};
