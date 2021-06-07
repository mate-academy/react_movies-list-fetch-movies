import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ addFilm }) => {
  const [query, setQuery] = useState('');
  const [film, setFilm] = useState(null);
  const [error, setError] = useState(false);

  const handleSearch = () => {
    request(query)
      .then((result) => {
        if (result.Response === 'False') {
          setFilm(null);

          return setError(true);
        }

        return setFilm(result);
      });
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!film) {
      return setError(true);
    }

    addFilm(film);
    setQuery('');

    return setFilm(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
              onChange={event => handleChange(event)}
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
              onClick={handleSearch}
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {!!film && (
          <MovieCard
            title={film.Title}
            description={film.Plot}
            imgUrl={film.Poster}
            imdbUrl={`https://www.imdb.com/title/${film.imdbID}`}
          />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addFilm: PropTypes.func.isRequired,
};
