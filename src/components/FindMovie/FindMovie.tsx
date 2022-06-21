/* eslint-disable no-console */
import React, { FormEvent, useState } from 'react';
import classnames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void,
  movies: Movie[],
}

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingError, setLoadingError] = useState(false);
  const [movieExists, setMovieExists] = useState(false);

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setLoadingError(false);
    setMovieExists(false);
  };

  const submitHandler = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movie && !movies
      .some(movieInState => movieInState.imdbID === movie.imdbID)) {
      addMovie(movie);
      setMovie(null);
    } else {
      setMovieExists(true);
    }

    setQuery('');
  };

  const movieFinder = (title: string) => {
    setLoading(true);

    getMovie(title)
      .then(movieFromserver => {
        setMovie(movieFromserver);
        setLoading(false);
      })
      .catch(error => {
        console.log('error', error);
        setLoadingError(true);
        setLoading(false);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitHandler}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              onChange={inputHandler}
              value={query}
              placeholder="Enter a title to search"
              className={classnames('input', {
                'is-danger': loadingError,
              })}
            />
          </div>
          {loadingError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {movieExists && (
            <p className="help is-danger">
              This movie already exists in the MovieList
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="find"
              type="button"
              className={classnames('button is-light', {
                'is-loading': loading,
              })}
              onClick={() => {
                movieFinder(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="add"
              disabled={!movie}
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
