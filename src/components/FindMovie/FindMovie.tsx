import React from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
type Props = {
  query: string;
  movie: Movie | null;
  loading: boolean;
  error: string | null;
  onQuery: (query: string) => void;
  onSubmit: (movies: React.FormEvent) => void;
  onError: (value: string | null) => void;
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  movie,
  loading,
  error,
  onQuery,
  onSubmit,
  onError,
  onAdd,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              onChange={event => {
                onQuery(event.target.value);
                onError(null);
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={query.trim().length === 0}
              data-cy="searchButton"
              type="submit"
              className={classNames('button', {
                'is-light': !loading,
                'is-loading': loading,
              })}
            >
              {movie ? 'Search again' : 'Find the movie'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                onClick={() => onAdd(movie)}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
