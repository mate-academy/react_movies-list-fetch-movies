import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
type Props = {
  handleQuery: (event: React.ChangeEvent<HTMLInputElement>) => void;
  query: string;
  previewMovie: Movie | null;
  handleSearch: (event: React.FormEvent) => void;
  addMovie: () => void;
  isLoading: boolean;
  error: string;
};

export const FindMovie: React.FC<Props> = ({
  handleQuery,
  query,
  previewMovie,
  handleSearch,
  addMovie,
  isLoading,
  error,
}) => {
  return (
    <>
      <form className="find-movie">
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
              className={
                error === 'Movie not found!' ? 'input is-danger' : 'input'
              }
              value={query}
              onChange={handleQuery}
            />
          </div>

          {error === 'Movie not found!' ? (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          ) : (
            ''
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              onClick={handleSearch}
              disabled={!query}
            >
              {!previewMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {previewMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
