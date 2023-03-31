import React, { ChangeEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [searcResult, setSearcResult] = useState<MovieData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isSubmit, setIsSubmit] = useState(false);

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then((response) => {
        if ((response as MovieData).Title) {
          setSearcResult(response as MovieData);
          setIsSubmit(true);

          return;
        }

        setHasError(true);
      })
      .finally(() => setIsLoading(false));
  };

  const handleClear = () => {
    setQuery('');
    setHasError(false);
    setIsSubmit(false);
    setSearcResult(null);
  };

  const handleQuery = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
    setIsSubmit(false);
    setSearcResult(null);
  };

  const getNewMovie = useCallback((newMovie) => {
    return {
      title: newMovie.Title,
      description: newMovie.Plot,
      imdbId: newMovie.imdbID,
      imgUrl: newMovie.Poster !== 'N/A'
        ? newMovie.Poster
        : 'https://via.placeholder.com/360x270.png?text=no%20preview',
      imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
    };
  }, [searcResult]);

  const handleAddButton = () => {
    addMovie(getNewMovie(searcResult));
    handleClear();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onSubmit}
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
              className="input is-dander"
              value={query}
              onChange={handleQuery}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              {'Can\'t find a movie with such a title'}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {searcResult && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddButton}
              >
                Add to the list
              </button>
            </div>
          )}

        </div>
      </form>

      {isSubmit && !isLoading && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={getNewMovie(searcResult)} />
        </div>
      )}

    </>
  );
};
