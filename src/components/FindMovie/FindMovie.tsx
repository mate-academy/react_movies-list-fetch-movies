import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { request } from '../../Api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = React.memo(
  ({ addMovie }) => {
    const [title, setTitle] = useState('');
    const [movie, setMovie] = useState(null);
    const [isError, setIsError] = useState(false);

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
      setTitle(event.target.value);
      setIsError(false);
    };

    const findMovie = () => {
      request(title)
        .then(res => {
          if (!res.Error) {
            setMovie(res);
          } else {
            setIsError(true);
            setMovie(null);
          }
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
                className={classNames('input', { 'is-danger': isError })}
                value={title}
                onChange={changeHandler}
              />
            </div>

            {isError
              && (
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
                onClick={findMovie}
              >
                Find a movie
              </button>
            </div>

            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={() => {
                  if (movie) {
                    addMovie(movie);
                    setMovie(null);
                    setTitle('');
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
  },
);
