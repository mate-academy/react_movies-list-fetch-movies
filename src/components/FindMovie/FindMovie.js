import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import './FindMovie.scss';

import { MovieCard, MovieCardShape } from '../MovieCard';
import { getMovie } from '../../api';

export const FindMovie = ({ addMovie, movies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const onClick = () => {
    if (!title) {
      setErrorMessage('Please enter movie title');

      return;
    }

    getMovie(title)
      .then((newMovie) => {
        if (!newMovie.Title) {
          setErrorMessage('There is no such movie');
          setMovie(null);

          return;
        }

        setMovie({
          title: newMovie.Title,
          description: newMovie.Plot,
          imgUrl: newMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}/`,
          imdbId: newMovie.imdbID,
        });
      })
      .catch(err => (
        // eslint-disable-next-line no-console
        console.warn('Error:', err.message)
      ));
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (movies.some(existingMovie => (
      existingMovie.imdbId === movie.imdbId
    ))) {
      setErrorMessage('This movie already exists in the list');

      return;
    }

    addMovie(movie);
    setTitle('');
    setMovie(null);
    setErrorMessage(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              name="movie-title"
              placeholder="Enter a title to search"
              className={ClassNames('input', {
                'is-danger': errorMessage,
              })}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setErrorMessage(null);
              }}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onClick}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!movie}
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
  movies: PropTypes.arrayOf(
    PropTypes.shape(MovieCardShape),
  ),
};

FindMovie.defaultProps = {
  movies: [],
};
