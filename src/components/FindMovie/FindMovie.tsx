import React, { useState } from 'react';
import classNames from 'classnames';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface Props {
  addMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchResult, setSearchResult] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (hasError) {
      setHasError(false);
    }
  };

  const handleMoviesSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(query.trim().toLocaleLowerCase())
      .then(response => {
        if ('Error' in response) {
          setHasError(true);
        }

        if ('Title' in response) {
          setSearchResult({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      }).finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddToList = () => {
    if (searchResult) {
      addMovie(searchResult);
    }

    setSearchResult(null);
    setQuery('');
    setHasError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleMoviesSearch}>
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
              onChange={handleInputChange}
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
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {searchResult && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {searchResult && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={searchResult} />
        </div>
      )}
    </>
  );
};
