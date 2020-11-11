import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

export const FindMovie = ({ setMovies, moviesList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);
  const [duplicateError, setDuplicateError] = useState(false);

  const BASE_URL = `http://www.omdbapi.com/?apikey=7301fdd3&t=${title}`;

  const getMovies = async() => {
    const response = await fetch(BASE_URL);
    const movies = await response.json();

    if (movies.Response === 'False') {
      setError(true);
      setTitle('');
    } else {
      setMovie(movies);
      setTitle('');
      setError(false);
    }
  };

  const findMovie = () => {
    getMovies();
    setDuplicateError(false);
  };

  const addMovie = (event) => {
    const alreadyInList = moviesList.some(item => item.imdbID === movie.imdbID);

    event.preventDefault();

    if (alreadyInList) {
      setDuplicateError(true);
      setTitle('');
    } else {
      setMovies([...moviesList, movie]);
      setMovie(false);
    }
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
              className={classNames(`input`, { 'is-danger': error === true })}
              value={title}
              onChange={event => setTitle(event.target.value)}
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              onClick={addMovie}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {duplicateError && (
          <p className="help is-danger">
            This Movie is already in list. Please choose another one.
          </p>
        )}
        <h2 className="title">Preview</h2>
        {movie && (<MovieCard movie={movie} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
  moviesList: PropTypes.arrayOf(PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Poster: PropTypes.string.isRequired,
    Plot: PropTypes.string.isRequired,
    Website: PropTypes.string.isRequired,
  })).isRequired,
};
