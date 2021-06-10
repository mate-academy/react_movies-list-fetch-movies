import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movies';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);

  const handleChange = (event) => {
    setTitle(event.target.value);
    setError(false);
  };

  const findMovie = () => {
    if (!title || !title.trim()) {
      setError(true);

      return;
    }

    getMovie(title)
      .then((result) => {
        if (result.Response === 'False') {
          setError(true);

          return;
        }

        setMovie({
          title: result.Title,
          description: result.Plot,
          imgUrl: result.Poster,
          imdbUrl: `http://www.imdb.com/title//${result.imdbID}/`,
          imdbId: result.imdbID,
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
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
              type="button"
              className="button is-light"
              onClick={findMovie}
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
