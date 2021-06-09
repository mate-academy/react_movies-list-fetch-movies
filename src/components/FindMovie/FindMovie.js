import React, { useState } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import classnames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/request';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [searchError, setError] = useState(false);

  const sendRequest = () => {
    getMovie(title)
      .then((result) => {
        if (result.Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = result;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
          imdbId: imdbID,
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
              className={classnames('input', { 'is-danger': searchError })}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
            />
          </div>

          { searchError && (
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
              onClick={sendRequest}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movie);
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
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
  addMovie: PropTypes.func.isRequired,
};
