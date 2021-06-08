import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api/movies';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [isMovieError, setError] = useState(false);

  const getNewMovie = () => {
    findMovie(movieTitle)
      .then((newMovie) => {
        if (newMovie.Response === 'False') {
          setError(true);

          return;
        }

        setMovie({
          title: newMovie.Title,
          description: newMovie.Plot,
          imgUrl: newMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
          imdbId: newMovie.imdbID,
        });

        setError(false);
        setTitle('');
      });
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
              className={classNames('input', { 'is-danger': isMovieError })}
              value={movieTitle}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
            />
          </div>

          {isMovieError && (
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
              onClick={getNewMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={(() => {
                addMovie(movie);
                setMovie(null);
              })}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
