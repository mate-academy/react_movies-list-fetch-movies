import React, { useState } from 'react';

import './FindMovie.scss';

import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState([]);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);

  const movieSearch = (movieName) => {
    getMovie(movieName)
      .then((data) => {
        setMovie({
          imdbId: data.imdbID,
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
        });
        setError(data.Error);
      });
  };

  const clear = () => {
    setMovie([]);
    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();

          if (!error && movie.length !== 0) {
            addMovie(movie);
            clear();
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
              onChange={({ target }) => {
                setTitle(target.value);
                setError(false);
                setMovie([]);
              }}
            />
          </div>

          <p className={classNames('help is-danger', { 'hide-help': !error })}>
            Can&apos;t find a movie with such a title
          </p>

        </div>

        <div className="field is-grouped">
          <div className="control">

            <button
              type="button"
              className="button is-light"
              onClick={() => movieSearch(title)}
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
