import React, { FC, ChangeEvent, FormEvent } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  isError: boolean;
  value: string;
  changeHandler: (event: ChangeEvent<HTMLInputElement>) => void;
  findMovie: (event: FormEvent<HTMLFormElement>) => void;
  addMovie: () => void;
  preview: Movie;
}

export const FindMovie: FC<Props> = ({
  isError,
  value,
  preview,
  changeHandler,
  findMovie,
  addMovie,
}) => (
  <>
    <form className="find-movie" onSubmit={findMovie}>
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
        </label>

        <div className="control">
          <input
            type="text"
            id="movie-title"
            value={value}
            onChange={changeHandler}
            placeholder="Enter a title to search"
            className={`input ${isError ? 'is-danger' : ''}`}
          />
        </div>

        {isError && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            type="submit"
            className="button is-light"
          >
            Find a movie
          </button>
        </div>

        <div className="control">
          <button
            type="button"
            className="button is-primary"
            onClick={addMovie}
          >
            Add to the list
          </button>
        </div>
      </div>
    </form>

    <div className="container">
      <h2 className="title">Preview</h2>
      {isError
        ? 'No such movie'
        : (<MovieCard {...preview} />)}
    </div>
  </>
);
