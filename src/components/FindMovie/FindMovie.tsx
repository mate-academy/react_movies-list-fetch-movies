import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import cls from 'classnames';

type Props = {
  onSubmit: (query: string) => void;
  onAdd: (movie: Movie) => void;
  movie: Movie | null;
  error: boolean;
  loader?: boolean; // Optional prop for loading state
  onInputChange?: () => void;
};

export const FindMovie: React.FC<Props> = ({
  onSubmit,
  onAdd,
  movie,
  error,
  loader,
  onInputChange,
}) => {
  const [query, setQuery] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit(query.trim());
      setQuery('');
    }
  };

  const handleAddBtnClick = () => {
    if (movie) {
      onAdd(movie);
    }

    setQuery('');
  };

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
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                if (onInputChange) {
                  onInputChange();
                }
              }}
              placeholder="Enter a title to search"
              className="input is-danger"
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
              disabled={query.length === 0}
              data-cy="searchButton"
              type="submit"
              className={cls('button is-light ', { 'is-loading': loader })}
            >
              Find a movie
            </button>
          </div>

          {loader && (
            <div className="control">
              <button className="button is-loading" disabled>
                Loading...
              </button>
            </div>
          )}

          {/* Show Add button only if movie details are available */}

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddBtnClick}
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