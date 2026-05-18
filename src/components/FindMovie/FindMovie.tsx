import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { toMovie } from '../../utils/movieUtils';
import { getMovie } from '../../api';
import './FindMovie.scss';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie = ({ onAddMovie }: Props) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const handleSearchInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    const normalizedValue = event.target.value
      .trimStart()
      .replace(/\s{2,}/g, ' ');

    setQuery(normalizedValue);
  };

  const handleAddMovie = (movie: Movie) => {
    onAddMovie(movie);
    setQuery('');
    setFoundMovie(null);
  };

  const handleSubmitSearch = (event: React.FormEvent) => {
    event.preventDefault();
    setFoundMovie(null);
    setHasError(false);
    setIsLoading(true);

    getMovie(query.trim())
      .then(response => {
        if ('Error' in response) {
          setHasError(true);

          return;
        }

        const movie = toMovie(response);

        setFoundMovie(movie);
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmitSearch}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleSearchInput}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {foundMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          <div className="control">
            {foundMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(foundMovie)}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
