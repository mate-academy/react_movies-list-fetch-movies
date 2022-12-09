import classNames from 'classnames';
import React from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  query: string,
  onChangeQuery: (text: string) => void,
  movie: Movie | null,
  error: boolean,
  onSubmit: (event: React.FormEvent<HTMLFormElement>, text: string) => void;
  onAddMovie: (movieToAdd: Movie) => void,
  isLoader: boolean,
}

export const FindMovie: React.FC<Props> = ({
  query,
  onChangeQuery,
  movie,
  error,
  onSubmit,
  onAddMovie,
  isLoader,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={event => onSubmit(event, query)}>
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
              className="input is-dander"
              value={query}
              onChange={event => onChangeQuery(event.target.value)}
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
              disabled={!query.length}
              className={classNames('button is-light', {
                'is-loading': isLoader,
              })}
            >
              Find a movie
            </button>
          </div>

          {movie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onAddMovie(movie)}
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
