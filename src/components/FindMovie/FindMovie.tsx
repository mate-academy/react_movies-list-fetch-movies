import React, { ChangeEvent, FormEvent } from 'react';
import './FindMovie.scss';

import cn from 'classnames';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type FindMovieProps = {
  query: string;
  onChangeQuery: (e: ChangeEvent<HTMLInputElement>) => void;
  onFindMovie: (movieQuery: string) => void;
  onAddMovie: () => void;
  isLoading: boolean;
  errorMessage: boolean;
  currentMovie: Movie | null;
};

export const FindMovie: React.FC<FindMovieProps> = ({
  query,
  onChangeQuery,
  onFindMovie,
  isLoading,
  errorMessage,
  currentMovie,
  onAddMovie,
}) => {
  const handlerSumbit = (e: FormEvent) => {
    e.preventDefault();

    onFindMovie(query);
  };

  return (
    <>
      <form onSubmit={handlerSumbit} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={onChangeQuery}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
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
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
            >
              {!currentMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {currentMovie && (
              <button
                onClick={onAddMovie}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
