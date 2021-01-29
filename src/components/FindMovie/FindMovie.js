import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [searchClicked, setSearchClicked] = useState(false);
  const [error, setError] = useState(false);
  const [trueMovie, setTrueMovie] = useState('');

  const onFormSend = () => {
    if (!trueMovie || trueMovie.Error) {
      return;
    }

    addMovie(trueMovie);
    setQuery('');
    setError(false);
    setTrueMovie('');
  };

  const onInputChange = (event) => {
    setSearchClicked(false);
    setQuery(event.target.value);
  };

  const onSearchClick = () => {
    setSearchClicked(true);
    getMovie(query)
      .then((result) => {
        if (result.Error) {
          setError(true);
        }

        setTrueMovie(result);
      });
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
              className="input is-danger"
              value={query}
              onChange={onInputChange}
              autoComplete="off"
            />
          </div>
          {searchClicked && error && (
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
              onClick={onSearchClick}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onFormSend}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!trueMovie.Error && trueMovie && <MovieCard {...trueMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
