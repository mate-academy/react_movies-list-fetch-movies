import classNames from 'classnames';
import React, { useState } from 'react';
import { getMovie } from '../API';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void,
  doubleAddError: boolean;
}

export const FindMovie: React.FC<Props> = ({ addMovie, doubleAddError }) => {
  const [query, setQuery] = useState<string>('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [queryError, setQueryError] = useState(false);

  const logError = () => {
    setQueryError(true);
    setFindedMovie(null);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    getMovie(query).then(movieFromServer => {
      setFindedMovie(movieFromServer);
    })
      .catch(logError);

    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
                { 'is-danger': queryError },
              )}
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setQueryError(false);
              }}
            />
          </div>
          {queryError && (
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
              disabled={queryError || !query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={queryError || (findedMovie === null)}
              onClick={() => {
                if (findedMovie) {
                  addMovie(findedMovie);
                  setFindedMovie(null);
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
        {doubleAddError
          ? (
            <div className="notification is-danger">
              <p>This movie has already been added.</p>
              <p>Please try to find another movie.</p>
            </div>
          ) : (
            findedMovie && (
              <MovieCard
                movie={findedMovie}
              />
            )
          )}
      </div>
    </>
  );
};
