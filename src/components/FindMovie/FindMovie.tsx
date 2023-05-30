import React from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface FindMovieProps {
  hasError: boolean,
  isLoading: boolean,
  query: string;
  setQuery: (text: string) => void;
  onFormSubmit: (event: React.FormEvent) => void;
  setHasError: (value:boolean) => void;
  isMovieFound: boolean,
  movie: Movie | null,
  addMovie: (movie: Movie | null) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({
  query,
  setQuery,
  onFormSubmit,
  isLoading,
  hasError,
  setHasError,
  isMovieFound,
  movie,
  addMovie,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={(event) => onFormSubmit(event)}>
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
              value={query}
              onChange={(event) => {
                setHasError(false);
                setQuery(event.target.value);
              }}
              className={cn('input', {
                'is-danger': hasError,
              })}
            />
          </div>

          {hasError && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {isMovieFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => addMovie(movie)}
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
