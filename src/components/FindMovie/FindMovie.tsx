import React, { useState } from 'react';
import cn from 'classnames';
import { getApi } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie | null) => void
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

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
                value={value}
                onChange={(event) => setValue(event.target.value)}
                placeholder="Enter a title to search"
                className={cn('input', { 'is-danger': !movie })}
              />
            </div>
          </label>

          {!movie
            && (
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
              onClick={async () => {
                setMovie(await getApi(value));
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovie(movie)}
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
