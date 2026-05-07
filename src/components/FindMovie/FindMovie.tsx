import React from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  searchInput: string;
  onSearch: (input: string) => void;
  onLoading: boolean;
  findMovieError?: boolean;
  errorText?: string | null;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  movie: Movie | null;
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  searchInput,
  onSearch,
  onLoading,
  findMovieError,
  errorText,
  movie,
  onSubmit,
  onAddMovie,
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
              data-cy="titleField"
              autoFocus
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', {
                'is-danger': findMovieError,
              })}
              value={searchInput}
              onChange={e => onSearch(e.target.value)}
            />
          </div>

          {findMovieError && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorText}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              disabled={!searchInput}
              className={cn('button is-light', {
                'is-active': searchInput !== '',
                'is-loading': onLoading,
              })}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => movie && onAddMovie(movie)}
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
          {movie && <MovieCard movie={movie} />}
        </div>
      )}
    </>
  );
};
