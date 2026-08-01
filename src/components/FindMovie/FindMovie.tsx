import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';

type Props = {
  findMovie: (query: string) => void;
  movies: Movie[];
  isError: boolean;
  setIsError: (err: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  findMovie,
  movies,
  isError,
  setIsError,
}) => {
  const [movieTitle, setMovieTitle] = useState('');

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
              className={`input ${!movies && 'is-danger'}`}
              value={movieTitle}
              onChange={event => {
                setMovieTitle(event.target.value);
                setIsError(false);
              }}
            />
          </div>

          {isError && (
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
              className="button is-light"
              onClick={event => {
                event.preventDefault();
                findMovie(movieTitle);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="addButton"
              type="button"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container" data-cy="previewContainer">
        <h2 className="title">Preview</h2>
        {/* <MovieCard movie={movie} /> */}
      </div>
    </>
  );
};
