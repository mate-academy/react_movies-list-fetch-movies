import React, { useContext } from 'react';
import classNames from 'classnames';
import { Button } from '../Button';
import { MovieCard } from '../MovieCard';
import { AppContext } from '../AppProvider';
import './FindMovie.scss';

export const FindMovie: React.FC = () => {
  const {
    query,
    movie,
    handleInput,
    handleSearch,
    isMovieExist,
    isSearch,
    addingMovie,
  } = useContext(AppContext);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearch}
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
              className="input is-dander"
              value={query}
              onChange={handleInput}
            />
          </div>

          {isMovieExist && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <Button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isSearch },
              )}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </Button>
          </div>

          { movie && (
            <div className="control">
              <Button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addingMovie}
              >
                Add to the list
              </Button>
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
