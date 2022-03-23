import React from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

interface Props {
  movie: Movie | undefined,
  handleTitle: (event: React.ChangeEvent<HTMLInputElement>) => void,
  handleGetMovies: () => void,
  addMovie: () => void,
  addError: boolean,
  isFound: boolean,
  isLoading: boolean,
  noMovieError: boolean,
}

export const FindMovie: React.FC<Props> = ({
  movie,
  handleTitle,
  handleGetMovies,
  addMovie,
  addError,
  isFound,
  isLoading,
  noMovieError,
}) => {
  const movieRepeatError = 'Movie already added';
  const noMovie = 'You need to find Movie first :)';

  return (
    <>
      <form className="find-movie">
        <div className="field">

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={
                classNames(
                  'input',
                  {
                    'is-danger': !isFound,
                  },
                )
              }
              onChange={handleTitle}
            />
          </div>

          {!isFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleGetMovies}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        {!isLoading
          ? (movie && <MovieCard movie={movie} />)
          : (<p>Loading...</p>) }
        {addError && movieRepeatError}
        {noMovieError && noMovie}
      </div>
    </>
  );
};
