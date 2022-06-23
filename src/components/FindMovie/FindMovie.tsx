/* eslint-disable no-console */
import React, { useEffect, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { Movie } from '../../react-app-env';
import { getMovie } from '../../api/api';

interface Props {
  addMove: (movie: Movie) => void,
  resetError: () => void,
  dublikate: boolean,
}

export const FindMovie: React.FC<Props> = (
  {
    addMove,
    resetError,
    dublikate,
  },
) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie>({
    Response: '',
    Title: 'not found',
    Poster: 'not found',
    imdbID: 'not found',
  });

  const [foundError, setFoundError] = useState(false);

  let initialRender = true;

  useEffect(() => {
    if (initialRender) {
      initialRender = false;

      return;
    }

    if (movie.Response === 'False') {
      setFoundError(true);
    }
  }, [movie]);

  const changeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (dublikate) {
      resetError();
    }

    setQuery(event.target.value);
  };

  const serchMovie = () => {
    if (dublikate) {
      resetError();
    }

    getMovie(query).then((result) => {
      console.log(result);

      setMovie(result);
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
              value={query}
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                {
                  'is-danger': foundError,
                },
              )}
              onChange={changeInput}
            />
          </div>
          {foundError
            && (
              <p className="field is-grouped">
                Can&apos;t find a movie with that title
              </p>
            )}

        </div>

        <div
          className={classNames('is-grouped', 'field')}
        >
          <div className="control">
            <button
              type="button"
              className="button is-light"
              data-cy="find"
              onClick={serchMovie}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className={classNames(
                'button',
                {
                  'is-primary': !dublikate,
                  'is-danger': dublikate,
                },
              )}
              data-cy="add"
              onClick={() => {
                addMove(movie);
              }}
            >
              Add to the list
            </button>
            {dublikate
            && (
              <span className="add-error">
                The film is already on the list
              </span>
            )}
          </div>
        </div>
      </form>

      <div className="container">
        {movie.Response === 'True'
          && (
            <>
              <h2 className="title">Preview</h2>
              <MovieCard
                id={movie.imdbID}
                movie={movie}
              />
            </>
          )}
        {movie.Response === 'False'
          && (
            <p>Try another tittle</p>
          )}
      </div>
    </>
  );
};
