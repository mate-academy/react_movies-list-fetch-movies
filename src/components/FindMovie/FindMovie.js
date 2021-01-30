import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import classnames from 'classnames';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/helpers';

export const FindMovie = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const getMovieByTitle = async() => {
    const transformedSearch = search.split(' ').join('+');
    const newMovie = await request(transformedSearch);

    if (newMovie.Response === 'False') {
      setError(true);
      setMovie(null);

      return;
    }

    if (error) {
      setError(false);
    }

    setMovie(newMovie);
    setSearch('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          getMovieByTitle();
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
              className={classnames('input', { 'is-danger': error })}
              value={search}
              onChange={event => setSearch(event.target.value)}
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
              onClick={getMovieByTitle}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => onAdd(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
