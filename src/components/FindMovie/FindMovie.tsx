import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { Movie } from '../../types';
import { getMovie } from '../../api';
import { isMovieData, isResponseError, parseMovie } from '../../helpers';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    if (isLoading) {
      getMovie(title)
        .then(data => {
          if (isMovieData(data)) {
            setMovie(parseMovie(data));
          }

          if (isResponseError(data)) {
            setIsError(true);
          }
        })
        .catch((error) => {
          // eslint-disable-next-line no-console
          console.log(error);
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [isLoading]);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);

    if (isError) {
      setIsError(false);
    }
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);
  };

  const handleAddMovie = () => {
    if (movie) {
      onAdd(movie);
    }

    setMovie(null);
    setTitle('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              data-cy="titleField"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={title}
              onChange={handleTitleChange}
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
              type="submit"
              data-cy="searchButton"
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!title.trim()}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                type="button"
                data-cy="addButton"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
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
