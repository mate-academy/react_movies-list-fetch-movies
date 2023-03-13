import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie, normalizeMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  addMovie: (card: Movie) => void,
  movies: Movie[],
};

export const FindMovie: React.FC<Props> = ({ addMovie, movies }) => {
  const [query, setQuery] = useState<string>('');
  const [requiredMovie, setRequiredMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const updateQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setIsError(false);
  };

  const getRequiredMovie = async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await getMovie(query.toLowerCase());

      if (!('Error' in response)) {
        setRequiredMovie(normalizeMovie(response));
        setQuery('');
      } else {
        throw new Error('er');
      }
    } catch {
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const updateList = () => {
    const isTheSameMovie = movies.find(movie => (
      movie.imdbId === requiredMovie?.imdbId
    ));

    if (isTheSameMovie) {
      setRequiredMovie(null);

      return;
    }

    if (requiredMovie) {
      addMovie(requiredMovie);
      setRequiredMovie(null);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={getRequiredMovie}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              name="name"
              value={query}
              onChange={updateQuery}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
            />
          </div>

          {isError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                {
                  'is-light': !loading,
                  'is-loading': loading,
                },
              )}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {requiredMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={updateList}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {requiredMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={requiredMovie} />
        </div>
      )}
    </>
  );
};
