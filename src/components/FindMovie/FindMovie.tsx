import React, { useState } from 'react';
import classNames from 'classnames';

import { findMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [querySearch, setQuerySearch] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const loadMovie = async (query: string) => {
    try {
      setIsLoading(true);
      const movieFromServer = await findMovie(query);

      if (movieFromServer.Response === 'False') {
        setErrorMessage(movieFromServer.Error);
      } else {
        setMovie(movieFromServer);
      }
    } catch (error) {
      throw new Error(`${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                onChange={(event) => {
                  setQuerySearch(event?.target.value);
                  setErrorMessage('');
                }}
                value={querySearch}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-danger"
              />
            </div>
          </label>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={() => loadMovie(querySearch)}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={() => {
                if (movie) {
                  onAddMovie(movie);
                }
              }}
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <div
          className={classNames('loader-wrapper', { 'is-active': isLoading })}
        >
          <div
            className="loader is-loading"
          />
        </div>

        {movie
        && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
