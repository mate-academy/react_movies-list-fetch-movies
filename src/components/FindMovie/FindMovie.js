import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState([null]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const movieSearch = (name) => {
    getMovie(name)
      .then((data) => {
        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
          imdbId: data.imdbID,
        });
        setError(data.Error);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();

          if (!error && movie.length !== 0) {
            addMovie(movie);

            setMovie([]);
            setTitle('');
          }
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
                setMovie([]);
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
              onClick={() => movieSearch(title)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {(!error && movie.length !== 0) && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
