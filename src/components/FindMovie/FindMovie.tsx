/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onAddMovie: (movie: Movie) => void;
  movieIsAdded: boolean;
  setMovieISAdded: (added: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movieIsAdded, setMovieISAdded }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie>();
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);

  const titleEntering = (event:React.ChangeEvent<HTMLInputElement>) => {
    setMovie(undefined);
    setMovieISAdded(false);
    setTitle(event.target.value);
    setHasError(false);
  };

  const findMovie = () => {
    setIsLoading(true);
    getMovie(title)
      .then(response => {
        setMovie(response);
        setIsLoading(false);
      })
      .catch(() => {
        setIsLoading(false);
        setHasError(true);
      });
  };

  const addMovie = () => {
    if (movie) {
      onAddMovie(movie);
    }

    setTitle('');
    setMovie(undefined);
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
              value={title}
              onChange={titleEntering}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': hasError },
              )}
            />
          </div>

          {hasError ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) : (
            <>
              {isLoading && <p className="help">Loading...</p>}
            </>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
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
        {movieIsAdded && <p className="help is-danger">This movie is alredy added</p>}
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
