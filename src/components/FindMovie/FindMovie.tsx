import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  changeHandler: (e: React.FormEvent<HTMLInputElement>) => void;
  movie: Movie | null;
  toFindMovie: (e: React.FormEvent<HTMLFormElement>) => void;
  movieNotFounded: boolean;
  addMovie: () => void;
};

export const FindMovie: React.FC<Props> = React.memo(({
  query, changeHandler, movie, toFindMovie, movieNotFounded, addMovie,
}) => {
  const [isLoading, setLoading] = useState(false);
  const submitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    setLoading(true);
    await toFindMovie(e);
    setLoading(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              name="input"
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
              value={query}
              onChange={changeHandler}
            />
          </div>

          {movieNotFounded && (
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
                'is-loading': isLoading === true,
              })}
              // eslint-disable-next-line no-unneeded-ternary
              disabled={query === '' ? true : false}
            >
              Find a movie
            </button>
          </div>

          {!!movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        {!!movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
});
