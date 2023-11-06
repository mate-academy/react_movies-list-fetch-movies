import React from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  movie: Movie | undefined;
  handleSetQuery: (value: string) => void;
  query: string;
  findMovie: (value: string) => void;
  canNotFind: boolean;
  handleCanNotFind: (value: boolean) => void;
  isLoading: boolean;
  handleSetMovies: (oneMovie: Movie, allMovies: Movie[]) => void;
  movies: Movie[];
};

const isLoadingClass = (value: boolean) => cn(
  'button is-light',
  { 'is-loading': value === true },
);

const isDangerClass = (value: boolean) => cn(
  'input',
  { 'is-danger': value === true },
);

export const FindMovie: React.FC<Props> = ({
  movie,
  handleSetQuery,
  query,
  findMovie,
  canNotFind,
  handleCanNotFind,
  isLoading,
  handleSetMovies,
  movies,
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
              className={isDangerClass(canNotFind)}
              value={query}
              onChange={(event) => {
                handleSetQuery(event.target.value);
                handleCanNotFind(false);
              }}
            />
          </div>

          {canNotFind && (
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
              className={isLoadingClass(isLoading)}
              disabled={query.length === 0}
              onClick={
                (e) => {
                  e.preventDefault();
                  findMovie(query);
                }
              }
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleSetMovies(movie, movies)}
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
