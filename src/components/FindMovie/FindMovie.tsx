/* eslint-disable no-debugger */
/* eslint-disable no-console */
import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getUser } from '../../api';

import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
  movieAdded: boolean;
  setMovieAdded: (arg: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie, movieAdded, setMovieAdded }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [title, setTitle] = useState<string>('');

  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [hasMovieError, setMovieError] = useState(false);
  const [loader, setLoader] = useState(false);

  const errorHandler = () => {
    setMovie(null);
    setMovieError(true);
    setLoader(false);
  };

  const findMovie = () => {
    setLoader(true);
    setMovieAdded(false);
    if (title === '') {
      errorHandler();
    } else {
      getUser(title)
        .then(movieFromServer => {
          if (movieFromServer.Response === 'False') {
            errorHandler();
          } else {
            setMovie(movieFromServer);
            setLoader(false);
            setMovieError(false);
          }
        })
        .catch(() => {
          setHasLoadingError(true);
        });
    }
  };

  const addMovie = () => {
    if (movie !== null) {
      onAddMovie(movie);
      setMovie(null);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': hasMovieError },
                )}
                value={title}
                onChange={event => setTitle(event.target.value)}
              />
            </div>
          </label>
          { hasMovieError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
          {loader && (<p>Loading...</p>)}
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
        { movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
        {movieAdded && <p>You have already added this movie</p>}
        {hasLoadingError && <h2>No server response</h2>}
      </div>
    </>
  );
};
