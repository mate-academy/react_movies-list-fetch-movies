import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';

import { getMovie } from '../../api';

import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
};

const transformApiMovie = (data: MovieData): Movie => ({
  title: data.Title,
  description: data.Plot,
  imgUrl:
    data.Poster === 'N/A'
      ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
      : data.Poster,
  imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
  imdbId: data.imdbID,
});

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [lastQuery, setLastQuery] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const isQueryValid = (currentQuery: string) => {
    return currentQuery !== '';
  };

  const isRepeatedQuery = (currentQuery: string) => {
    return lastQuery === currentQuery;
  };

  const showValidationError = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
      setError(true);
    }, 300);
  };

  const showRepeatedSearchLoading = () => {
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 300);
  };

  const prepareSearch = (currentQuery: string) => {
    setIsLoading(true);
    setError(false);
    setMoviePreview(null);
    setLastQuery(currentQuery);
  };

  const loadMovie = (currentQuery: string) => {
    prepareSearch(currentQuery);

    getMovie(currentQuery)
      .then(data => {
        if ('Error' in data) {
          setError(true);

          return;
        }

        setMoviePreview(transformApiMovie(data));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (isLoading) {
      return;
    }

    const currentQuery = query.trim();

    if (!isQueryValid(currentQuery)) {
      showValidationError();

      return;
    }

    if (isRepeatedQuery(currentQuery)) {
      showRepeatedSearchLoading();

      return;
    }

    loadMovie(currentQuery);
  };

  const handleAddMovie = () => {
    if (moviePreview) {
      onAdd(moviePreview);
    }

    setMoviePreview(null);
    setLastQuery(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
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
              className={cn('input', error && 'is-danger')}
              value={query}
              onChange={handleInput}
              autoComplete="off"
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
              className={cn('button is-light', isLoading && 'is-loading')}
              disabled={!query}
            >
              {moviePreview ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {moviePreview && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {moviePreview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
