/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovies } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addedMovies: (movie: Movie) => void;
  inList: boolean;
  setInList: (is: boolean) => void;
}

export const FindMovie: React.FC<Props> = ({ addedMovies, inList, setInList }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const findButton = () => {
    getMovies(title).then(response => {
      setMovie(response.Response === 'True' ? response : null);
      setError(response.Response === 'False');
      setInList(false);
    });
  };

  const addButton = () => {
    if (movie !== null) {
      addedMovies(movie);
    }

    setMovie(null);
    setTitle('');
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
              className={classNames('input', {
                'is-danger': error,
              })}
              value={title}
              onChange={event => {
                setTitle(event.target.value.toLocaleLowerCase());
              }}
            />
          </div>
          {error
            && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )}
          {inList
            && (
              <p className="help is-danger">
                This is movie already in list.
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findButton}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addButton}
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
