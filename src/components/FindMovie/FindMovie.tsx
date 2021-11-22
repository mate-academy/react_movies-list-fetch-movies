/* eslint-disable jsx-a11y/label-has-associated-control */
import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovieByTitle } from '../../utils/api';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [errNotFound, setErrNotFound] = useState(false);
  const [movieTitle, setMovieTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const searchMovies = async (e: React.FormEvent) => {
    e.preventDefault();

    const resultMovies = await getMovieByTitle(movieTitle);

    if (resultMovies.Error) {
      setErrNotFound(true);

      return;
    }

    setMovie(resultMovies);
  };

  const handelChange = (text: string) => {
    if (text !== movieTitle) {
      setErrNotFound(false);
    }

    setMovieTitle(text);
  };

  const addToList = () => {
    if (movie) {
      addMovie(movie);
      setMovieTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form
        onSubmit={(e) => searchMovies(e)}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              autoComplete="off"
              className={classNames('input', { 'is-danger': errNotFound })}
              value={movieTitle}
              onChange={(e) => handelChange(e.target.value)}
            />
          </div>

          {errNotFound && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">

        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
