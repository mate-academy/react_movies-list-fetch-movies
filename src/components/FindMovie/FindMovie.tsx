import React, { FormEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [visibleMovie, setVisibleMovie] = useState<Movie | null>(null);

  const addMovie = () => {
    if (visibleMovie) {
      onAdd(visibleMovie);
    }

    setQuery('');
    setVisibleMovie(null);
  };

  const findMovie = (event: FormEvent) => {
    event.preventDefault();
    getMovie(query)
      .then((response: Movie) => {
        if (response.Error) {
          setVisibleMovie(null);
          setError(response.Error);
        } else {
          setVisibleMovie(response);
          setError('');
        }
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => findMovie(event)}
      >
        <div className="field">
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
                { 'is-danger': error },
              )}
              value={query}
              onChange={(event) => setQuery(event.target.value)}

            />
          </div>

          {error && (
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
              data-cy="find"
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={addMovie}
              disabled={!visibleMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {visibleMovie && (<MovieCard movie={visibleMovie} />)}
      </div>
    </>
  );
};
