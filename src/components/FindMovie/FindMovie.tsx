import React, { useEffect, useRef } from 'react';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type FindMovieProps = {
  query: string
  setQuery: (event: string) => void,
  applyQuery: (event: string) => void,
  onSubmit: () => void,
  errorMessage: string,
  movie: Movie,
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<FindMovieProps> = ({
  query,
  setQuery,
  applyQuery,
  onSubmit,
  errorMessage,
  movie,
  addMovie,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          onSubmit();
        }}
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
              onChange={(event) => {
                setQuery(event.target.value);
                applyQuery(event.target.value);
              }}
              ref={inputRef}
            />
          </div>
          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              onClick={onSubmit}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

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
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
