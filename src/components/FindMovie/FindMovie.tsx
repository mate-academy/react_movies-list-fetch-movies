import React, { FormEvent, useState } from 'react';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie:(movie: Movie) => void;
  hasAddError: boolean;
};

export const FindMovie: React.FC<Props> = ({
  addMovie,
  hasAddError,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasError, setError] = useState(false);

  const getMovieFromServer = async () => {
    const movieFromServer = await getMovie(query);

    if (movieFromServer.Error) {
      setError(true);
      setQuery('');

      return;
    }

    setMovie(movieFromServer);
    setError(false);
  };

  const handleSubmit = (event:FormEvent) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => handleSubmit(event)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${hasError && 'is-danger'}`}
              onChange={(event) => {
                setQuery(event.target.value);
              }}
            />
          </div>

          {hasError && (
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
              onClick={() => getMovieFromServer()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}

      {hasAddError && (
        <p style={{ color: 'red' }}>
          This movie has already been added to the list
        </p>
      )}
    </>
  );
};
