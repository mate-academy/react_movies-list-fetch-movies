import React, { useState } from 'react';
import PropTypes from 'prop-types';
import ClassNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { findMovie } from '../../api/api';

export const FindMovie = ({ addedMovie }) => {
  const [movie, getMovie] = useState(null);
  const getMovieFromServer = () => {
    findMovie(document.getElementById('movie-title').value)
      .then((result) => {
        result.Response !== 'False'
          ? getMovie(
            {
              title: result.Title,
              description: result.Plot,
              imgUrl: result.Poster,
              imdbUrl:
              `https://www.imdb.com/title/${result.imdbID}/`,
              imdbId: result.imdbID,
            },
          )
          : getMovie(undefined);
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
              className={ClassNames(
                'input',
                { ' is-danger': movie === undefined },
              )}
              onChange={() => {
                getMovie(null);
              }}
            />
          </div>

          {
            movie === undefined
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
              onClick={() => {
                getMovieFromServer();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addedMovie(movie);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {
        !movie
        || (
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
  addedMovie: PropTypes.func.isRequired,
};
