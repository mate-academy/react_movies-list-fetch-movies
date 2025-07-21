import React from 'react';
import './FindMovie.scss';
import { ResponseError } from '../../types/ResponseError';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  query: string;
  onTyping: (query: string) => void;
  onSearch: () => void;
  loading: boolean;
  error: ResponseError | undefined;
  onAdd: () => void;
  movie: Movie | null;
}

export const FindMovie: React.FC<Props> = ({
  query,
  onTyping,
  onSearch,
  loading,
  error,
  onAdd,
  movie,
}) => {
  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSearch();
  };

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
              onChange={e => onTyping(e.target.value)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
            />
          </div>

          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error.Error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={query.trim().length === 0}
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
                onClick={onAdd}
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
