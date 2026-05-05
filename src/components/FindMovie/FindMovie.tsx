import classNames from 'classnames';

import React from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  foundMovie: MovieData | null;
  hasError: boolean;
  isLoading: boolean;
  onQueryChange: (value: string) => void;
  onSearch: () => void;
  onAddMovie: () => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  foundMovie,
  hasError,
  isLoading,
  onQueryChange,
  onSearch,
  onAddMovie,
}) => {
  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();

          onSearch();
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={event => {
                onQueryChange(event.target.value);
              }}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={onAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard
            movie={{
              title: foundMovie.Title,
              description: foundMovie.Plot,
              imgUrl:
                foundMovie.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : foundMovie.Poster,
              imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
              imdbId: foundMovie.imdbID,
            }}
          />
        </div>
      )}
    </>
  );
};
