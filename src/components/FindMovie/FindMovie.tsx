/* eslint-disable no-console */
import React, { useState } from 'react';
import cn from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import './FindMovie.scss';

type Props = {
  onAddMovie: (foundMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  // eslint-disable-next-line max-len
  const DEFAULT_POSTER = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query.trim())
      .then((response) => {
        if ('Title' in response) {
          const {
            Title,
            Plot,
            Poster,
            imdbID,
          } = response;

          setFoundMovie({
            title: Title,
            description: Plot,
            imgUrl: Poster === 'N/A' ? DEFAULT_POSTER : Poster,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imdbId: imdbID,
          });
        } else {
          setIsError(true);
        }
      })
      .catch(() => setIsError(true))
      .finally(() => setLoading(false));
  };

  const addMovie = () => {
    onAddMovie(foundMovie as Movie);
    setQuery('');
    setFoundMovie(null);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsError(false);
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
              className={cn('input', {
                'is-danger': isError,
              })}
              value={query}
              onChange={handleInputChange}
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
              data-cy="searchButton"
              type="submit"
              className={cn(
                'button',
                'is-light',
                {
                  'is-loading': loading,
                },
              )}
              disabled={!query}
            >
              {foundMovie ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>
          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
              >
                Add to the list
              </button>
            </div>
          )}
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
