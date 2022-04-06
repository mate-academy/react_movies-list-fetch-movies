/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { request } from '../../api/requests';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [titleQuery, setTitleQuery] = useState('');
  const [queriedMovie, setQueridMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setTitleQuery(event.target.value);
  };

  const reset = () => {
    setTitleQuery('');
    setQueridMovie(null);
  };

  const submitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (queriedMovie) {
      addMovie(queriedMovie);
      reset();
    }
  };

  const getFilm = () => {
    request(titleQuery).then(loadedMovie => {
      // eslint-disable-next-line no-console
      if (loadedMovie.Title) {
        setQueridMovie(loadedMovie);
      } else {
        setHasError(true);
      }
    });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitHandler}
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
              className={classNames('input', { 'is-danger': hasError })}
              value={titleQuery}
              onChange={changeHandler}
            />
          </div>

          {hasError && (
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
              onClick={getFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {queriedMovie && (
          <MovieCard movie={queriedMovie} />
        )}
      </div>
    </>
  );
};

interface Props {
  addMovie: (movie: Movie) => void;
}
