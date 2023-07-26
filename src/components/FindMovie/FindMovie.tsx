import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  onChangeInput: (str: string) => void;
  onSubmit: (str: string) => void;
  loading: boolean;
  movie: Movie | null;
  isError: boolean;
  setIsError: (val: boolean) => void;
  onAddMovie: () => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  onChangeInput,
  onSubmit,
  movie,
  loading,
  isError,
  setIsError,
  onAddMovie,
}) => {
  const onChangeHandler
    = (event: React.ChangeEvent<HTMLInputElement>) => {
      onChangeInput(event.target.value);
      setIsError(false);
    };

  const onSubmitHandler = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit(query);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmitHandler}>
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
                classNames('input', {
                  'is-danger': isError,
                })
              }
              value={query}
              onChange={onChangeHandler}
            />
          </div>

          {
            isError
            && (
              <p className="help is-danger" data-cy="errorMessage">
                Can&apos;t find a movie with such a title
              </p>
            )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light',
                {
                  'is-loading': loading,
                })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {
            movie
            && (
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
            )
          }
        </div>
      </form>

      {
        movie
        && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </div>
        )
      }
    </>
  );
};
