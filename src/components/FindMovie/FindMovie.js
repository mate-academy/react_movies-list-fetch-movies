import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [notFound, setNotFound] = useState(false);

  const findMovie = () => {
    getMovie(query)
      .then((result) => {
        if (result.Response === 'False') {
          setNotFound(true);

          return;
        }

        const {
          Title: title,
          Plot: description,
          Poster: imgUrl,
          imdbID: imdbId,
        } = result;

        const imdbUrl = `https://www.imdb.com/title/${imdbId}`;

        setMovie({
          title,
          description,
          imgUrl,
          imdbUrl,
          imdbId,
        });
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onAdd(movie);
          setQuery('');
          setMovie(null);
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
              className={classNames('input', {
                'is-danger': notFound,
              })}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setNotFound(false);
              }}
            />
          </div>

          {notFound && (
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
  onAdd: PropTypes.func.isRequired,
};
