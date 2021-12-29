/* eslint-disable no-alert */
import React, { useState } from 'react';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type OnAdd = (movie: Movie) => void;

type Props = {
  onAdd: OnAdd,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [needShowError, setNeedShowError] = useState(false);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={`input ${needShowError ? 'is-danger' : ''}`}
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value);
                  setNeedShowError(false);
                }}
              />
            </div>
          </label>
          {
            needShowError
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
              onClick={async () => {
                if (title === '') {
                  return;
                }

                const foundMovie = await getMovie(title);

                if (foundMovie.Error) {
                  setNeedShowError(true);
                  setMovie(null);
                } else {
                  setNeedShowError(false);
                  setMovie(foundMovie);
                }
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={async () => {
                if (movie !== null) {
                  onAdd(movie);
                  setTitle('');
                  setMovie(null);
                }
              }}
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
