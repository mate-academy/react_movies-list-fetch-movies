import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  handleSubmit: (e: React.FormEvent<Element>) => void;
  onQueryChange: (value: string) => void;
  handleAddMovie: () => void;
  isMovie: boolean;
  query: string;
  loading: boolean;
  addMovie: Movie | null;
}

export const FindMovie: React.FC<Props> = ({
  handleSubmit,
  onQueryChange,
  handleAddMovie,
  isMovie,
  query,
  loading,
  addMovie,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={classNames('input', { 'is-danger': !isMovie })}
              value={query}
              onChange={e => onQueryChange(e.target.value)}
            />
          </div>

          {!isMovie && (
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
                'is-loading': loading,
              })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {addMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {addMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={addMovie} />
        </div>
      )}
    </>
  );
};
