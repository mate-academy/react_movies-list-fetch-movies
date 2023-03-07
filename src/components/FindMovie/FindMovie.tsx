import classNames from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  MouseEvent,
} from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  query: string;
  onChangeQuery: (e: ChangeEvent<HTMLInputElement>) => void;
  onFindMovie: (e: FormEvent<HTMLFormElement>) => void;
  movie: Movie | null;
  isLoading: boolean;
  isError: boolean;
  onAddMovie: (e: MouseEvent<HTMLButtonElement>) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  onChangeQuery: onChangeValue,
  onFindMovie,
  movie,
  isLoading,
  isError,
  onAddMovie,
}) => {
  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFindMovie}
      >
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
              onChange={onChangeValue}
            />
          </div>

          {isError && (
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={query.length === 0}
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
                onClick={onAddMovie}
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
