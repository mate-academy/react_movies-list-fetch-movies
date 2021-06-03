import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getFilmByTitle } from '../api/api';

export const FindMovie = ({ onAddMovie }) => {
  const [find, setFind] = useState('');
  const [findError, setFindError] = useState(false);
  const [film, setFilm] = useState(null);

  const findMovie = async() => {
    try {
      const newFilm = await getFilmByTitle(find);

      setFindError(false);
      setFilm(newFilm);
      setFind('');
    } catch (error) {
      setFindError(true);
      setFilm(null);
    }
  };

  const findHandler = (event) => {
    setFind(event.target.value);
    setFindError(false);
  };

  const addMovieHandler = () => {
    onAddMovie(film);
    setFilm(null);
  };

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
            // className="input is-danger"
              className={classNames(
                'input',
                { 'is-danger': findError },
              )}
              value={find}
              onChange={findHandler}
            />
          </div>

          <p
            className="help is-danger"
            style={findError ? {} : { visibility: 'hidden' }}
          >
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              disabled={!find}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!film}
              onClick={addMovieHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {film
        && (
        <>
          <h2 className="title">Preview</h2>
          <MovieCard {...film} />
        </>
        )
      }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
