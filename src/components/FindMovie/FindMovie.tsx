import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsError(false);
    setQuery(event.currentTarget.value);
  };

  const findMovie = async () => {
    setIsLoading(true);

    const movieFromServer = await getMovie(query);

    if (movieFromServer.Error) {
      setIsError(true);
    } else {
      setCurrentMovie(movieFromServer);
    }

    setIsLoading(false);
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (currentMovie !== null) {
      addMovie(currentMovie);
      setQuery('');
      setCurrentMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFormSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': isError,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames({
                button: true,
                'is-light': true,
                'is-loading': isLoading,
              })}
              onClick={findMovie}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              data-cy="add"
              disabled={currentMovie === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {currentMovie !== null && (
          <MovieCard movie={currentMovie} />
        )}
      </div>
    </>
  );
};
