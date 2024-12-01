import React, { useMemo, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [newMovie, setNewMovie] = useState<Movie | null>(null);

  const DEFAULT_IMG = useMemo(() => {
    return 'https://via.placeholder.com/360x270.png?text=no%20preview';
  }, []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleSearchButton = (currentQuery: string) => {
    setIsLoading(true);

    getMovie(currentQuery.trim())
      .then((response: MovieData | ResponseError) => {
        if ('Title' in response) {
          const {
            Poster,
            Title,
            Plot,
            imdbID,
          } = response;

          setNewMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_IMG : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        } else {
          setHasError(true);
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  const handleFormSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    handleSearchButton(query);
  };

  const handleAddMovie = () => {
    if (newMovie) {
      addMovie(newMovie);
    }

    setNewMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
      >
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {hasError && (
            <p
              data-cy="errorMessage"
              className="help is-danger"
            >
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
              onClick={() => handleSearchButton(query)}
            >
              Find a movie
            </button>
          </div>

          {newMovie && (
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

      {newMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={newMovie} />
        </div>
      )}
    </>
  );
};
