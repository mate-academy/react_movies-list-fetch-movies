import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ addMovieToList, checkMovie }) => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);
  const [query, setQuery] = useState('');
  const [isMovieInList, setIsMovieInList] = useState(false);
  const [isMovieAdded, setIsMovieAdded] = useState(false);

  const findMovie = (event) => {
    event.preventDefault();

    getMovie(query)
      .then((movieFromServer) => {
        if (movieFromServer.Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie(movieFromServer);
        setError(false);
      });
  };

  const handleChange = (event) => {
    const { value } = event.target;

    setQuery(value);
    setError(false);
    setIsMovieInList(false);
    setIsMovieAdded(false);
  };

  const addMovie = (event) => {
    event.preventDefault();

    if (movie === null) {
      return;
    }

    if (checkMovie(movie.imdbID)) {
      setIsMovieInList(true);
    } else {
      addMovieToList(movie);
    }

    setQuery('');
    setMovie(null);
    setIsMovieAdded(true);
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={handleChange}
            />
          </div>

          <p className={classNames('help', 'is-danger', {
            'help--visible': error,
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
            <p className={classNames('help', 'is-danger', {
              'help--visible': isMovieInList,
            })}
            >
              Movie is already in list
            </p>
          </div>
        </div>
      </form>

      <div className="container">
        {isMovieAdded && (
          <h2 className="title">Movie successfully added!</h2>
        )}
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard
              title={movie.Title}
              description={movie.Plot}
              imgUrl={movie.Poster}
              imdbUrl={`https://www.imdb.com/title/${movie.imdbID}`}
            />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovieToList: PropTypes.func.isRequired,
  checkMovie: PropTypes.func.isRequired,
};
