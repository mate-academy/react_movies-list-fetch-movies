import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/getFilm';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const movieSearch = () => {
    getFilm(title)
      .then((data) => {
        if (data.Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        const {
          Title,
          Plot,
          Poster,
          imdbID,
        } = data;

        setMovie({
          title: Title,
          description: Plot,
          imgUrl: Poster,
          imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={({ target }) => {
                setTitle(target.value);
                setError(false);
              }}
            />
          </div>

          {error
            && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )
          }

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={movieSearch}
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
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie
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
  addMovie: PropTypes.func.isRequired,
};
