// #region imports
import React, { useEffect, useState } from 'react';
import cn from 'classnames';

import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
// #endregion

type Props = {
  onAdd?: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd = () => {} }) => {
  const [query, setQuery] = useState('');
  const [searchResult, setSearchResult] = useState<Movie | null>(null);
  const [hasSearchError, setHasSearchError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    await getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setHasSearchError(true);

          return;
        }

        const { Poster, Title, Plot, imdbID } = response;

        setSearchResult({
          title: Title,
          description: Plot,
          imgUrl:
            Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
          imdbId: imdbID,
          imdbUrl: `https://www.imdb.com/title/${imdbID}`,
        });
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    setHasSearchError(false);
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={cn('input', {
                'is-danger': hasSearchError,
              })}
              value={query}
              onChange={e => setQuery(e.target.value)}
            />
          </div>

          {hasSearchError && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {searchResult && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(searchResult);
                  setSearchResult(null);
                  setQuery('');
                  setHasSearchError(false);
                }}
              >
                Add to the list
              </button>
            )}
          </div>
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
