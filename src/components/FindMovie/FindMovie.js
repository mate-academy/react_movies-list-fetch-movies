import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import classnames from 'classnames';

import { MovieCard } from '../MovieCard';
import * as api from '../../api/helpers';

export const FindMovie = ({ onAdd }) => {
  const [search, setSearch] = useState('');
  const [movie, setMovie] = useState('');

  const getMovie = async() => {
    const newMovie = await api.getMovies(search);

    setMovie(newMovie);
  };

  const addNMovie = (event) => {
    event.preventDefault();
    if (movie.Error) {
      return;
    }

    onAdd(movie);
    setSearch('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={addNMovie}
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
              className={classnames('input', { 'is-danger': movie?.Error })}
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </div>
          {movie?.Error && (
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
              onClick={getMovie}
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
      {movie?.Title && (
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
