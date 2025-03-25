import React from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

export const FindMovie: React.FC = ({
  addFilm,
  findMovie,
  inputTitle,
  setInputTitle,
  getInfoMovie,
  isLoading,

  error,
  setError,
}) => {
  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          event.preventDefault();
          getInfoMovie();
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
              className={error ? 'input is-danger' : 'input'}
              value={inputTitle}
              onChange={event => {
                setInputTitle(event.target.value);
                setError(null);
              }}
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
              disabled={inputTitle.length === 0}
              data-cy="searchButton"
              type="submit"
              className={isLoading ? 'button is-loading' : 'button is-light'}
            >
              Find a movie
            </button>
          </div>

          {findMovie !== null && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addFilm}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {findMovie !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findMovie} />
        </div>
      )}
    </>
  );
};
