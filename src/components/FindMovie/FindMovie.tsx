import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  movie: Movie | null;
  setMovie: (value: Movie | null) => void;
  isLoading: boolean;
  error: string;
  setError: (value: string) => void;
  query: string;
  onQueryChange: (value: string) => void;
  handleSubmit: (query: string) => void;
  onAdd: (m: Movie) => void;
};
export const FindMovie: React.FC<Props> = ({
  movie,
  setMovie,
  isLoading,
  error,
  setError,
  query,
  onQueryChange,
  handleSubmit,
  onAdd,
}) => {
  const addBtnHandler = () => {
    if (movie) {
      onAdd(movie);
    }

    onQueryChange('');
    setMovie(null);
  };

  const formOnSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query.trim()) {
      handleSubmit(query.trim());
      onQueryChange('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={formOnSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={event => {
                onQueryChange(event.target.value);
                setError('');
              }}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addBtnHandler}
              >
                Add to the list
              </button>
            </div>
          )}
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
