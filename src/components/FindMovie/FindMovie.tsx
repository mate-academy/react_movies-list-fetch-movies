import React, { useState } from 'react';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovieToState: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovieToState }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const getMovieFormHandler = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    await getMovie(query)
      .then(receivedMovie => {
        if (receivedMovie.Response === 'False') {
          setHasError(true);

          return;
        }

        setMovie(receivedMovie);
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={getMovieFormHandler}
      >
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
            <div className="control">
              <input
                name="movieTitle"
                type="text"
                id="movie-title"
                value={query}
                placeholder="Enter a title to search"
                className="input is-danger"
                onChange={event => {
                  setQuery(event.currentTarget.value);
                  setHasError(false);
                }}
              />
            </div>
          </label>

          {hasError && (
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
              onClick={() => {
                if (movie) {
                  addMovieToState(movie);
                  setQuery('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard
            movie={movie}
          />
        )}
      </div>
    </>
  );
};
