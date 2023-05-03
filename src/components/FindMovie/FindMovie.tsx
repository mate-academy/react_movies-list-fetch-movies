import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  setQuery: React.Dispatch<React.SetStateAction<string>>,
  movieFound: Movie | undefined,
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>,
  setMovie: React.Dispatch<React.SetStateAction<Movie | undefined>>
  query: string,
  showError: boolean,
  setShowError: (showError: boolean) => void,
  isRequested: boolean,
  setIsRequested: (showError: boolean) => void,
  isNowRequested: boolean,
  setIsNowRequested: (showError: boolean) => void,
}

export const FindMovie: React.FC<Props> = ({
  setQuery,
  movieFound,
  setMovies,
  setMovie,
  query,
  showError,
  setShowError,
  isRequested,
  setIsRequested,
  isNowRequested,
  setIsNowRequested,
}) => {
  const [value, setValue] = useState('');

  useEffect(() => {
    setShowError(false);
  }, [query]);

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
              value={value}
              onChange={(event) => setValue(event.target.value)}
            />
          </div>

          {showError && isRequested && (
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
              className={classNames(
                'button is-light',
                { 'is-loading': isNowRequested },
              )}
              onClick={(event) => {
                event.preventDefault();
                setQuery(value);
                setIsRequested(true);
                setIsNowRequested(true);
              }}
              disabled={value === ''}
            >
              Find a movie
            </button>
          </div>

          {movieFound && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  setMovies(
                    prevMovies => [...prevMovies, movieFound],
                  );
                  setQuery('');
                  setValue('');
                  setMovie(undefined);
                  setIsNowRequested(false);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movieFound && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movieFound} />
        </div>
      )}
    </>
  );
};
