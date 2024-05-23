import React, { useState } from 'react';
import cn from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { normalizeMovieData } from '../../utils/normalizeMovieData';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  addMovie: (m: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handlerFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(true);
          setPreview(null);
        } else {
          setError(false);
          setPreview(normalizeMovieData(data));
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handlerAddMovie = () => {
    if (preview) {
      addMovie(preview);
      setPreview(null);
      setQuery('');
    }
  };

  const handlerChangeQuery = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (error) {
      setError(false);
    }

    setQuery(evt.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handlerFormSubmit}>
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
              className={cn('input', { 'input is-danger': error })}
              value={query}
              onChange={handlerChangeQuery}
            />
          </div>

          {error && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handlerAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
