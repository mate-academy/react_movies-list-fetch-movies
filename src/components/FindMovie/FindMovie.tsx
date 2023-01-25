import React, { ChangeEvent, useCallback, useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';

type Props = {
  onAdd: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = React.memo(
  ({ onAdd }) => {
    const [query, setQuery] = useState('');
    // eslint-disable-next-line max-len
    const [searchResponse, setSearchResponse] = useState<MovieData | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [searchError, setSearchError] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const onSubmitHandler = (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);

      getMovie(query)
        .then((response) => {
          if ((response as MovieData).Title) {
            setSearchResponse(response as MovieData);
            setIsSubmitted(true);

            return;
          }

          setSearchError(true);
        }).finally(() => setIsLoading(false));
    };

    const onClear = () => {
      setQuery('');
      setSearchError(false);
      setIsSubmitted(false);
      setSearchResponse(null);
    };

    const queryHandler = (event: ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setSearchError(false);
      setIsSubmitted(false);
      setSearchResponse(null);
    };

    const getCurrentMovie = useCallback((foundedMovie) => {
      return {
        title: foundedMovie.Title,
        description: foundedMovie.Plot,
        imdbId: foundedMovie.imdbID,
        imgUrl: foundedMovie.Poster !== 'N/A'
          ? foundedMovie.Poster
          : 'https://via.placeholder.com/360x270.png?text=no%20preview',
        imdbUrl: `https://www.imdb.com/title/${foundedMovie.imdbID}`,
      };
    }, [searchResponse]);

    const addButtonHandler = () => {
      onAdd(getCurrentMovie(searchResponse));
      onClear();
    };

    return (
      <>
        <form
          className="find-movie"
          onSubmit={onSubmitHandler}
        >
          <div className="field">
            <label className="label" htmlFor="movie-title">
              Movie title
            </label>

            <div className="control">
              <input
                data-cy="titleField"
                type="text"
                value={query}
                onChange={queryHandler}
                id="movie-title"
                placeholder="Enter a title to search"
                className="input is-dander"
              />
            </div>

            { searchError && (
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
                className={cn(
                  'button is-light',
                  { 'is-loading': isLoading },
                )}
                disabled={(!query)}
              >
                Find a movie
              </button>
            </div>

            {searchResponse && (
              <div className="control">
                <button
                  data-cy="addButton"
                  type="button"
                  className="button is-primary"
                  onClick={addButtonHandler}
                >
                  Add to the list
                </button>
              </div>
            )}
          </div>
        </form>
        {(isSubmitted && !isLoading) && (
          <div className="container" data-cy="previewContainer">
            <h2 className="title">Preview</h2>
            <MovieCard movie={getCurrentMovie(searchResponse)} />
          </div>
        )}
      </>
    );
  },
);
