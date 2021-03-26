import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/helpers';

export const FindMovie = ({ movies, addFilm }) => {
  const [query, queryHandler] = useState('');
  const [movie, findMovie] = useState({});
  const [errorFilm, errorHandler] = useState(false);

  const addMovieHandler = () => request(query).then((response) => {
    if (response.Response === 'True') {
      queryHandler('');
      errorHandler(false);

      return findMovie({
        title: response.Title,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        description: response.Plot,
        imdbId: response.imdbID,
      });
    }

    return errorHandler(true);
  });

  const findMovieHandler = () => {
    if (Object.keys(movie).length !== 0) {
      addFilm((movies) => {
        const uniqueMovies = movies.filter((film) => {
          if (film.imdbId === movie.imdbId) {
            return false;
          }

          return film;
        });

        return [...uniqueMovies, movie];
      });
      findMovie({});
    }
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
              className={classNames('input', {
                'is-danger': errorFilm,
              })}
              value={query}
              onChange={event => queryHandler(event.target.value)}
            />
          </div>

          {errorFilm && (
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
              onClick={addMovieHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={findMovieHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {Object.keys(movie).length > 0 && (
        <>
          <h2 className="title">Preview</h2>
          <MovieCard
            key={movie.imdbId}
            {...movie}
          />
        </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }),
  ),

  addFilm: PropTypes.func.isRequired,
};

FindMovie.defaultProps = {
  movies: [],
};
