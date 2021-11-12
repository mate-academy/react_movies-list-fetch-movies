import classNames from 'classnames';
import React, { useState } from 'react';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';
import './FindMovie.scss';

type Props = {
  propAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ propAddMovie }) => {
  const [input, setInput] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    setMovie(null);
    setIsError(false);
    setInput(event.currentTarget.value);
  };

  const movieFound = (result: Movie) => {
    setMovie(result);
    setIsLoading(false);
    setInput('');
  };

  const responseError = () => {
    setIsLoading(false);
    setIsError(true);
  };

  const searchMovie = () => {
    setIsLoading(true);
    request(input)
      .then(result => (
        result.Response === 'False'
          ? responseError()
          : movieFound(result)
      ));
  };

  const addMovie = () => {
    if (movie) {
      propAddMovie(movie);
      setInput('');
      setMovie(null);
      setIsError(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
        }}
      >
        <div className="field">
          <div className="label">
            Movie title
          </div>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': isError,
              })}
              value={input}
              onChange={handleInput}
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
              type="submit"
              className="button is-light"
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">
          {`Preview${isLoading ? ' ...Loading' : ''}`}
        </h2>
        {movie && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
