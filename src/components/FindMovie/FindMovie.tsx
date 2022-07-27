import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../api';

type Props = {
  onAdd(newMovie: Movie): void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [newMovie, setMovie] = useState<Movie | null>(null);
  const [hasQueryError, setQuerryError] = useState(false);

  const handleQueryChange = async () => {
    const foundedMovie = await getMovie(query);

    if (foundedMovie?.Error) {
      setQuerryError(true);
      setMovie(null);
    } else {
      setMovie(foundedMovie);
      setQuerryError(false);
    }

    setQuery('');
  };

  const handleOnAddMovie = () => {
    if (newMovie !== null) {
      onAdd(newMovie);
    }

    setMovie(null);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames(
                'input',
                { 'is-danger': hasQueryError },
              )}
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {hasQueryError
            && (
              <p className="help is-danger">
                Can not find a movie with such a title
              </p>
            )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleQueryChange}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={newMovie === null}
              onClick={handleOnAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && <MovieCard movie={newMovie} />}
      </div>
    </>
  );
};
