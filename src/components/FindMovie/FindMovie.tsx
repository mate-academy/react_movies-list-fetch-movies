import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';
import classNames from 'classnames';

type Props = {
  query: string;
  movie: MovieData | null;
  hasError: boolean;
  setQuery: (query: string) => void;
  setFindMovie: (value: MovieData | null) => void;
  setHasError: (value: boolean) => void;
  setMovies: React.Dispatch<React.SetStateAction<MovieData[]>>;
  isLoading: boolean;
  setIsLoading: (value: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  setQuery,
  query,
  movie,
  setFindMovie,
  setHasError,
  hasError,
  setMovies,
  isLoading,
  setIsLoading,
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
              value={query}
              onChange={event => {
                setHasError(false);
                setQuery(event.target.value);
              }}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'input is-danger': hasError })}
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
              disabled={!query.trim()}
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={event => {
                event.preventDefault();
                setIsLoading(true);

                getMovie(query)
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  .then((res: any | MovieData | ResponseError) => {
                    if (res.Response === 'False') {
                      setFindMovie(null);
                      setHasError(true);
                    } else {
                      setFindMovie(res as MovieData);
                    }
                  })
                  .catch(() => setHasError(true))
                  .finally(() => setIsLoading(false));
              }}
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
                onClick={() => {
                  setMovies(prev => {
                    const isAdded = prev.some(m => m.imdbID === movie.imdbID);

                    if (!isAdded) {
                      return [...prev, movie];
                    }

                    return prev;
                  });
                  setFindMovie(null);
                  setQuery('');
                }}
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
