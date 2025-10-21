import React from 'react';
import './FindMovie.scss';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  movieData: MovieData | null;
  loading: boolean;
  onSubmit: (event: React.FormEvent) => void;
  movieError: string;
  addMovie: (movie: MovieData) => void;
  errorMessage: string;
}

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  movieData,
  loading,
  onSubmit,
  movieError,
  addMovie,
  errorMessage,
}) => {
  return (
    <>
      <form className="find-movie" onSubmit={event => onSubmit(event)}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={event => setQuery(event.target.value)}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={errorMessage ? 'input is-danger' : 'input'}
            />
          </div>

          <p className="help is-danger" data-cy="errorMessage">
            {movieError ? `Can&apos;t find a movie with such a title` : ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={query ? false : true}
              data-cy="searchButton"
              type="submit"
              className={
                loading ? `button is-light is-loading` : `button is-light`
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movieData ? (
              <button
                onClick={() => addMovie(movieData)}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            ) : (
              ''
            )}
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {movieData ? <MovieCard movie={movieData} /> : ''}
      </div>
    </>
  );
};
