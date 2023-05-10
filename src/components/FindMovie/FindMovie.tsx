import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string,
  onChangeQuery: (event: React.ChangeEvent<HTMLInputElement>) => void,
  onSubmit: (query: string) => void,
  noMovieFound: boolean,
  onAddToList: () => void,
  previevMovie: Movie | null,
  onLoading: () => void,
  isLoading: boolean,
};

export const FindMovie: React.FC<Props> = ({
  query,
  onChangeQuery,
  onSubmit,
  noMovieFound,
  onAddToList,
  previevMovie,
  onLoading,
  isLoading,
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
              className="input is-dander"
              value={query}
              onChange={(event) => onChangeQuery(event)}
            />
          </div>

          {noMovieFound && (
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
              onClick={(event) => {
                onSubmit(query);
                event.preventDefault();
                onLoading();
              }}
            >
              { previevMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {previevMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => onAddToList()}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {previevMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previevMovie} />
        </div>
      )}
    </>
  );
};
