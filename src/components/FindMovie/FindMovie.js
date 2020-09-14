import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ onAdd }) => {
  const [movieFromServer, setMovieFromServer] = useState(null);
  const [title, setTitle] = useState('');
  const [isDanger, setIsDanger] = useState(false);

  const foundMovie = () => {
    getMovie(title)
      .then((movie) => {
        movie.Response === 'False'
          ? setIsDanger(true)
          : setMovieFromServer(movie);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          foundMovie();
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
              className={cn('input', { 'is-danger': isDanger })}
              value={title}
              onChange={(event) => {
                setMovieFromServer(null);
                setIsDanger(false);
                setTitle(event.target.value);
              }}
            />
          </div>

          {isDanger
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
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                onAdd(movieFromServer);
                setTitle('');
              }}
              disabled={!movieFromServer}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movieFromServer
          && (
            <MovieCard
              title={movieFromServer.Title}
              description={movieFromServer.Plot}
              imgUrl={movieFromServer.Poster}
              imdbUrl={movieFromServer.imdbUrl}
            />
          )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
