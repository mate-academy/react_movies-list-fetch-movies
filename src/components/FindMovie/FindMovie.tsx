import React, { useContext } from 'react';
import './FindMovie.scss';
import { DispatchContext, StateContext } from '../../context/ReduxContex';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

export const FindMovie: React.FC = () => {
  const { movie, query, error, submit } = useContext(StateContext);
  const dispatch = useContext(DispatchContext);

  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={event =>
                dispatch({ type: 'setQuery', value: event.target.value })
              }
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': error })}
              value={query}
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
              onClick={() => dispatch({ type: 'onSubmit' })}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', {
                'is-loading': submit && !movie,
              })}
              disabled={!query.length}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                onClick={() => dispatch({ type: 'addMovie' })}
                data-cy="addButton"
                type="button"
                className="button is-primary"
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
