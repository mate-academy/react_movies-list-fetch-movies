import React, { useState, useCallback } from 'react';
import classnames from 'classnames';
import { findMovie } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  allMovie: Movie[];
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ allMovie, onAddMovie }) => {
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [findError, setFindError] = useState(false);
  const [addedToList, setAddedToList] = useState(false);

  const findMovieButton = useCallback(() => {
    findMovie(query)
      .then(movie => setCurrentMovie(movie))
      .catch(error => {
        if (error.message === 'Movie is undefined') {
          setFindError(true);
        }
      });
  }, [query]);

  const handleEventSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setFindError(false);
    setCurrentMovie(null);
    setQuery('');

    if (currentMovie) {
      onAddMovie(currentMovie);
    }

    if (allMovie.some(movi => movi.imdbID === currentMovie?.imdbID)) {
      setAddedToList(true);
    } else {
      setAddedToList(false);
    }
  };

  return (
    <>
      <form
        onSubmit={handleEventSubmit}
        className="find-movie"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Enter a movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setFindError(false);
              }}
              placeholder="Enter a title to search"
              className={classnames('input', {
                'is-danger': findError,
              })}
            />
          </div>

          {findError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              onClick={() => findMovieButton()}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              disabled={!currentMovie}
              data-cy="add"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {currentMovie && (
          <MovieCard movie={currentMovie} />
        )}

        {addedToList && (
          <article className="message is-danger">
            <div className="message-header mb-3">
              Film has already been added to the list
            </div>
          </article>
        )}
      </div>
    </>
  );
};
