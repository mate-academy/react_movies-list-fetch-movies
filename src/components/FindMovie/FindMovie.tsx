import React from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  input: string;
  movie: Movie | null;
  click: boolean,
  onFind: () => void;
  onAdd: () => void;
  changeInput: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const FindMovie: React.FC<Props> = ({
  input,
  movie,
  click,
  onFind,
  onAdd,
  changeInput,
}) => (
  <>
    <form className="find-movie">
      <div className="field">
        <label className="label" htmlFor="movie-title">
          <span>Movie title</span>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                {
                  'is-danger': !movie?.Title && click && input !== '',
                },
              )}
              value={input}
              onChange={changeInput}
            />
          </div>
        </label>

        {!movie?.Title && click && (
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
            onClick={onFind}
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            type="button"
            className="button is-primary"
            onClick={onAdd}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

    {movie?.Title && click && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard
          movie={movie}
        />
      </div>
    )}
  </>
);
