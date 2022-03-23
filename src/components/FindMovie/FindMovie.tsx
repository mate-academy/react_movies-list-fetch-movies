import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  onAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [foundedMovie, setFoundedMovie] = useState<Movie | null>(null);

  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const onHandleFindButton = () => {
    setIsLoading(true);
    setHasError(false);
    getMovie(title)
      .then((movie) => {
        setIsLoading(false);
        if (!movie) {
          setHasError(true);
          setFoundedMovie(null);
        } else {
          setFoundedMovie(movie);
        }
      })
      .catch(() => setHasError(true));
  };

  const onHandleAddMovieToList = () => {
    if (foundedMovie) {
      onAddMovie(foundedMovie);
      setTitle('');
      setFoundedMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  { 'is-danger': hasError },
                )}
                value={title}
                onChange={onTitleChange}
              />
            </div>
          </label>
          {hasError && (
            <p className=" help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={onHandleFindButton}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={onHandleAddMovieToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {isLoading && (
          <div>
            Loading...
          </div>
        )}

        {foundedMovie && (
          <MovieCard movie={foundedMovie} />
        )}
      </div>
    </>
  );
};
