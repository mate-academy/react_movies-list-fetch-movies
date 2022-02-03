/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import { findMovie } from '../../api/api';

type Props = {
  onAdd: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const handleFindMovie = async () => {
    const film = await findMovie(title);

    if (!film.imdbID) {
      setError(true);
    } else {
      setMovie(film);
    }
  };

  const clearInput = () => {
    setTitle('');
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
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
              className={classNames(
                'input',
                { 'is-danger': error },
              )}
              value={title}
              onChange={handleChangeTitle}
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
              onClick={() => handleFindMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie ? (
              <button
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(movie);
                  clearInput();
                }}
              >
                Add to the list
              </button>
            ) : (
              <button
                type="button"
                className="button is-primary"
                disabled
              >
                Add to the list
              </button>
            )}
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
