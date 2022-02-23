/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import classNames from 'classnames';

import { getMovieByTitle } from '../../api/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  onMovieAdd: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isError, setIsError] = useState(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setIsError(false);
  };

  const onFindClick = () => {
    getMovieByTitle(title)
      .then(mov => setMovie(mov))
      .then(() => setIsError(true));
  };

  const onAddClick = () => {
    if (movie) {
      onMovieAdd(movie);
    }

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
              className={classNames(
                'input',
                { 'is-danger': !movie && isError },
              )}
              value={title}
              onChange={onTitleChange}
            />
          </div>

          {!movie && isError && (
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
              onClick={() => onFindClick()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => onAddClick()}
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
