import React from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  queryInput: string;
  setQueryInput: React.Dispatch<React.SetStateAction<string>>;
  handleChange: () => Promise<void>;
  movie: Movie;
  handleSubmit: (event: React.FormEvent) => void;
  searchError: boolean;
};

export const FindMovie: React.FC<Props> = ({
  queryInput,
  setQueryInput,
  handleChange,
  movie,
  handleSubmit,
  searchError,
}) => (
  <>
    <form
      className="find-movie"
      onSubmit={handleSubmit}
    >
      <div className="field">
        <label className="label" htmlFor="movie-title">
          Movie title
          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={searchError ? 'input is-danger' : 'input'}
              value={queryInput}
              onChange={event => setQueryInput(event.target.value)}
            />
          </div>
        </label>
        {searchError && (
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
            onClick={() => handleChange()}
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
      {movie.Title ? (
        <MovieCard movie={movie} />
      ) : '' }
    </div>
  </>
);
