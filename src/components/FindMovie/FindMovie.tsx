/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';

import { AddMovie } from '../../react-app-env';
import { MovieCard } from '../MovieCard';
import { request } from '../../api';

export const FindMovie: React.FC<AddMovie> = ({ addMovie }) => {
  const [movie, setMovie] = useState();
  const [searchTitle, setSearchTitle] = useState('');
  const [isMovieFound, setIsMovieFound] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const findMovie = async () => {
    setIsLoading(true);

    const response = await request(searchTitle);

    setIsLoading(false);

    if (response.Response === 'False') {
      setIsMovieFind(false);

      return;
    }

    setMovie(response);
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
              className={classnames('input', { 'is-danger': !isMovieFind })}
              value={searchTitle}
              onChange={(event) => {
                setSearchTitle(event.target.value);
                setIsMovieFind(true);
              }}
            />
          </div>

          {!isMovieFind && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classnames('button', 'is-light', { 'is-loading': isLoading })}
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={classnames('button', 'is-primary')}
              disabled={!isMovieFind}
              onClick={() => movie && addMovie(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
