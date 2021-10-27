import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);

  return (
    <>
      <form
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={query}
                placeholder="Enter a title to search"
                className={cn('input', { 'is-danger': error })}
                onChange={event => {
                  setQuery(event.currentTarget.value);
                  setError(false);
                }}
              />
            </div>
          </label>

          <p className="help is-danger" style={{ visibility: error ? 'visible' : 'hidden' }}>
            Can&apos;t find a movie with such a title
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={async () => {
                await getMovie(query)
                  .then(film => setMovie(film))
                  .catch(() => setError(true));
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={() => {
                if (movie !== null) {
                  addMovie(movie);
                  setQuery('');
                  setMovie(null);
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
