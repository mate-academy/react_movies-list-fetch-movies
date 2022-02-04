/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import { findMovie } from '../../api/api';

type Props = {
  onAdd: (movie: Movie) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ onAdd, movies }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState<string>('');
  const [error, setError] = useState<boolean>(false);
  const [alreadyHave, setAlreadyHave] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFindMovie = async () => {
    setIsLoading(true);
    const film = await findMovie(title);

    if (!film.imdbID) {
      setError(true);
    } else {
      setMovie(film);
    }

    setIsLoading(false);
    setAlreadyHave(false);
  };

  const clearInput = () => {
    if (!error) {
      setTitle('');
      setMovie(null);
    }
  };

  const handleChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(false);
    setAlreadyHave(false);
  };

  const doHaveFilm = () => {
    if (movie && (movies.some(film => film.imdbID === movie.imdbID))) {
      setAlreadyHave(true);
    }
  };

  const handleAddButton = () => {
    if (movie) {
      onAdd(movie);
    }

    doHaveFilm();
    clearInput();
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
          {alreadyHave && (
            <p className="help is-danger">
              The movie is already on page
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddButton}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
