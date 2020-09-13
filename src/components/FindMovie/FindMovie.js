import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, updateMovieTitle] = useState('');
  const [loadMovie, createMovie] = useState(null);
  const [error, toggleError] = useState(false);
  const [preview, setPreview] = useState(false);

  const findMovie = async() => {
    const movie = await getMovie(movieTitle);

    if (movie.Response === 'False') {
      toggleError(true);
      setPreview(false);

      return;
    }

    createMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      imdbId: movie.imdbID,
    });

    toggleError(false);
    setPreview(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieTitle) {
      findMovie(movieTitle);
      updateMovieTitle('');
    }
  };

  const handleChange = (e) => {
    updateMovieTitle(e.target.value);

    toggleError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => handleSubmit(e)}
        autoComplete="off"
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
              className={classes('input', { 'is-danger': error })}
              autoComplete="off"
              value={movieTitle}
              onChange={handleChange}
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
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(loadMovie);
                setPreview(false);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {preview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...loadMovie} />
        </div>
      )}

    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
