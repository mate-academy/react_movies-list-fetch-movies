/* eslint-disable operator-linebreak */
/* eslint-disable arrow-body-style */
/* eslint-disable no-console */
/* eslint-disable arrow-parens */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = (props) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const findMovie = (e) => {
    e.preventDefault();
    if (query) {
      setLoading(true);
      request(query).then((res) => {
        if (res.Error) {
          setError(true);
          setMovie(null);
        } else {
          setError(false);
          setMovie(res);
          setQuery('');
        }

        setLoading(false);
      });
    }
  };

  const addToList = () => {
    if (movie) {
      const isAdded = props.movies.some((item) => item.imdbId === movie.imdbID);

      if (isAdded) {
        return;
      }

      props.addMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
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
              onChange={(e) => {
                setError(false);
                setQuery(e.target.value);
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
              type="submit"
              className="button is-light"
              disabled={loading}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToList}
              disabled={loading}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie &&
          (!loading ? (
            <MovieCard
              title={movie.Title}
              description={movie.Plot}
              imgUrl={movie.Poster}
              imdbUrl={`https://www.imdb.com/title/${movie.imdbID}`}
            />
          ) : (
            '...Loading'
          ))}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({ imdbId: PropTypes.string })),
};

FindMovie.defaultProps = {
  movies: [],
};
