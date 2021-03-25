import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { movieRequest } from '../../api/filmAPI';

export const FindMovie = ({ movieAdder }) => {
  const [isMovieFound, setMovieStatus] = useState(false);
  const [isErrorVisible, setErrorVisibility] = useState(false);
  const [movie, setMovie] = useState(null);
  const [input, setInput] = useState('');

  const inputChangeHandler = (event) => {
    setInput(event.target.value);
    setErrorVisibility(false);
  };

  const getMovie = () => {
    movieRequest(input).then((response) => {
      if (response.Response === 'True') {
        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });
        setMovieStatus(true);
      } else {
        setMovieStatus(false);
        setErrorVisibility(true);
        setMovie(null);
      }
    });
  };

  const addMovie = () => {
    if (isMovieFound && movie !== null) {
      movieAdder(movie);
    }

    setInput('');
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
              className={ClassNames('input', { 'is-danger': isErrorVisible })}
              value={input}
              onChange={inputChangeHandler}
            />
          </div>

          {isErrorVisible && (
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
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {isMovieFound && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movieAdder: PropTypes.func.isRequired,
};
