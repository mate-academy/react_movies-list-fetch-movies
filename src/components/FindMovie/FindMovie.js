import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';

import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import { request } from '../../api/api';

export const FindMovie = ({ addNewMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({});
  const [hasError, setError] = useState(false);

  const addTitle = (event) => {
    const { value } = event.target;

    setTitle(value);

    setError(false);
  };

  const findMovies = async() => {
    const newMovie = await request(title);

    if (newMovie.Error) {
      setError(true);
    }

    setMovie({
      title: newMovie.Title,
      description: newMovie.Plot,
      imgUrl: newMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
      imdbId: newMovie.imdbID,
    });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();

          addNewMovie(movie);
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
              className={classNames('input', { 'is-danger': hasError })}
              value={title}
              onChange={addTitle}
            />
          </div>

          <p className={classNames('help', { 'is-danger': hasError })}>
            {hasError && (
              <p>Can&apos;t find a movie with such a title</p>
            )}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovies}
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie.title && (
          <MovieCard
            title={movie.title}
            description={movie.description}
            imgUrl={movie.imgUrl}
            imdbUrl={`https://www.imdb.com/title/${movie.imdbUrl}`}
          />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = PropTypes.shape({
  addNewMovie: PropTypes.func.isRequired,
}).isRequired;
