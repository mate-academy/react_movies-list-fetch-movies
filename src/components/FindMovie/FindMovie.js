import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [movieNew, setMovieNew] = useState({});
  const [isMovieFound, setIsMovieFound] = useState(false);

  const inputTitle = (value) => {
    setTitle(value);
    setErrorMessage('');
    setIsMovieFound(false);
  };

  const handleResult = async() => {
    getMovie(title)
      .then((movieFromServer) => {
        if (movieFromServer.Title) {
          setMovieNew({ ...movieFromServer });
          setIsMovieFound(true);
        } else {
          setErrorMessage(`Can't find a movie with such a title`);
        }
      });
  };

  const submitResult = () => {
    addMovie(movieNew);
    setMovieNew({});
    setTitle('');
    setIsMovieFound(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          submitResult();
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
              className="input is-danger"
              value={title}
              onChange={event => inputTitle(event.target.value)}
            />
          </div>
          {errorMessage ? (
            <p className="help is-danger">
              {errorMessage}
            </p>
          ) : ''}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleResult}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!isMovieFound}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {isMovieFound ? (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movieNew} />
        </div>
      ) : ''}

    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
