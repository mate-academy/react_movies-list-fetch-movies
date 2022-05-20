import React, { useCallback } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

type Props = {
  previewMovie: Movie | null;
  setPreviewMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setTitleQuery: React.Dispatch<React.SetStateAction<string>>;
  titleQuery: string;
  getMovieFromServer: () => Promise<void>;
  isFindErrorVisible: boolean;
  setFindErrorVisible: React.Dispatch<React.SetStateAction<boolean>>;
  isMovieRepeat: boolean;
  checkMovieRepeat: (title: string) => boolean;
  setMovieRepeat: React.Dispatch<React.SetStateAction<boolean>>;
};

export const FindMovie: React.FC<Props> = ({
  previewMovie,
  setPreviewMovie,
  setMovies,
  setTitleQuery,
  titleQuery,
  getMovieFromServer,
  isFindErrorVisible,
  setFindErrorVisible,
  isMovieRepeat,
  checkMovieRepeat,
  setMovieRepeat,
}) => {
  const isInputEmpty = useCallback((input: string) => {
    return !input.trim();
  }, []);

  const isInputValid = useCallback((input: string) => {
    return input.match(/[A-Za-z0-9А-Яа-я .,!?-]/g);
  }, []);

  const handleFindButton = useCallback(async () => {
    if (isInputEmpty(titleQuery)) {
      setFindErrorVisible(true);

      return;
    }

    if (previewMovie && previewMovie.Title === titleQuery) {
      return;
    }

    await getMovieFromServer();
  }, [getMovieFromServer, titleQuery, previewMovie]);

  const handleAddMovieButton = useCallback(() => {
    if (!previewMovie) {
      return;
    }

    if (checkMovieRepeat(previewMovie.imdbID)) {
      setMovieRepeat(true);

      return;
    }

    setMovies((prevValue) => [...prevValue, previewMovie]);
    setTitleQuery('');
    setPreviewMovie(null);
  }, [previewMovie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => e.preventDefault()}
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
              className={classNames(
                'input',
                { 'is-danger': isFindErrorVisible || isMovieRepeat },
              )}
              value={titleQuery}
              onChange={({ target }) => {
                const { value } = target;

                if (isInputEmpty(value)) {
                  setTitleQuery('');

                  return;
                }

                if (!isInputValid(value[value.length - 1])) {
                  return;
                }

                setMovieRepeat(false);
                setFindErrorVisible(false);
                setTitleQuery(value);
              }}
            />
          </div>

          {isFindErrorVisible && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isMovieRepeat && (
            <p className="help is-danger">
              This movie already in the list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames(
                'button',
                { 'is-primary': !isFindErrorVisible },
                { 'is-light': isFindErrorVisible },
              )}
              onClick={handleFindButton}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className={classNames(
                'button',
                { 'is-primary': previewMovie },
                { 'is-light': !previewMovie },
              )}
              onClick={handleAddMovieButton}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {previewMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={previewMovie}
          />
        </div>
      )}
    </>
  );
};
