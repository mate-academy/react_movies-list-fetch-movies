import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api/findMovie';

export const FindMovie = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const onFindMovie = async() => {
    const newMovie = await findMovie(query);

    if (newMovie.Response === 'False') {
      setError(true);
    }

    const normalizeMovie = {
      title: newMovie.Title,
      description: newMovie.Plot,
      imgUrl: newMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
      imdbId: newMovie.imdbID,
    };

    setMovie(normalizeMovie);
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setError(false);
              }}
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
              onClick={onFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                onAddMovie(movie);
                setQuery('');
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {
        movie && movie.title && !error
        && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
        )
      }
    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
