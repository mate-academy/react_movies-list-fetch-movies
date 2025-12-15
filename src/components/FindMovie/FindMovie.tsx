import React from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  setQuery: React.Dispatch<React.SetStateAction<string>>;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  setIsFailed: React.Dispatch<React.SetStateAction<boolean>>;
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
  setMovie: React.Dispatch<React.SetStateAction<Movie | null>>;
  isFailed: boolean;
  isSubmitted: boolean;
  isLoading: boolean;
  query: string;
  movie?: Movie | null;
}

export const FindMovie: React.FC<Props> = ({
  setQuery,
  setIsSubmitted,
  setIsFailed,
  setMovies,
  setMovie,
  query,
  isFailed,
  isLoading,
  movie,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={event => event.preventDefault()}>
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
              className={classNames('input', { 'is-danger': isFailed })}
              value={query}
              onChange={event => {
                setQuery(event.target.value);
                setIsSubmitted(false);
                setIsFailed(false);
              }}
            />
          </div>

          {isFailed && (
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
              disabled={!query}
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={() => {
                setIsSubmitted(true);
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
                  setMovies(prevMovies => {
                    if (prevMovies.some(mov => mov.imdbId === movie.imdbId)) {
                      return prevMovies;
                    }

                    return [...prevMovies, movie];
                  });
                  setMovie(null);
                  setQuery('');
                  setIsFailed(false);
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
