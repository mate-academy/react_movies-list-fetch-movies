import React, { useState } from 'react';
import classNames from 'classnames';

import * as api from '../../api/api';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  onMovieAdd: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | null>(null);

  const findMovie = async () => {
    try {
      const newMovie = await api.getMovie(title);

      setMovie(newMovie);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const submit: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (movie) {
      onMovieAdd(movie);

      setMovie(null);
      setTitle('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Title"
                className={classNames('input', { 'is-danger': error })}
                value={title}
                onChange={(e) => {
                  setTitle(e.currentTarget.value);
                  setError(null);
                }}
              />
            </div>
          </label>
          {error && (
            <p className="help is-danger">
              {error}
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
              type="submit"
              className="button is-primary"
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
