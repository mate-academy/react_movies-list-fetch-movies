import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onSearch: (event: React.FormEvent<HTMLFormElement>) => void;
  queryHandler: (event: React.ChangeEvent<HTMLInputElement>) => void;
  movie: Movie | null;
  addMovie: () => void;
  findButtonIsDisabled: boolean;
  addButtonIsActive: boolean;
  errorMessage: boolean;
  isLoading: boolean;
};

export const FindMovie: React.FC<Props> = ({
  onSearch,
  queryHandler,
  movie,
  addMovie,
  findButtonIsDisabled,
  addButtonIsActive,
  errorMessage,
  isLoading,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={onSearch}>
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
              className={`input ${errorMessage ? 'is-danger' : ''}`}
              onChange={queryHandler}
            />
          </div>

          {errorMessage && (
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={findButtonIsDisabled}
            >
              Find a movie
            </button>
          </div>

          {addButtonIsActive && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
