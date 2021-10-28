import React, { FC, useState } from 'react';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

import './FindMovie.scss';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [isFound, setFound] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setFound(false);
  };

  const movieFinder = async () => {
    const newMovie = await getMovie(query);

    if (newMovie.Response === 'False') {
      setFound(true);
      setMovie(null);

      return;
    }

    setQuery('');
    setMovie(newMovie);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': isFound },
              )}
              value={query}
              onChange={changeHandler}
            />
          </div>

          {!isFound || (
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
              onClick={movieFinder}
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
                onAdd(movie as Movie);
                setMovie(null);
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
