/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovieByTitle } from '../../api';

interface Props {
  addMovie: (movie: Movie | null) => void;
  errMess: string;
  cancelErrMess: () => void;
}

export const FindMovie: React.FC<Props> = ({
  addMovie,
  errMess,
  cancelErrMess,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState<string>('');
  const [error, setError] = useState<boolean>(false);

  const findMovie = () => {
    cancelErrMess();

    if (!query) {
      return;
    }

    setMovie(null);
    setError(false);
    getMovieByTitle(query)
      .then((mov: Movie) => {
        if (mov.imdbID) {
          setMovie(mov);
          setQuery('');
        } else {
          setError(true);
          console.log(mov);
          setQuery('');
        }
      });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const handleAddMovie = () => {
    addMovie(movie);
    setMovie(null);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={error
                ? 'input is-danger'
                : 'input'}
              value={query}
              onChange={handleInput}
              autoComplete="off"
            />
          </div>

          {error
            && (
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
              onClick={findMovie}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie
          && <MovieCard movie={movie} />}
      </div>
      <div>
        {errMess.length > 0
          && (
            <p className="mt-3 has-text-danger">
              {errMess}
            </p>
          )}
      </div>
    </>
  );
};
