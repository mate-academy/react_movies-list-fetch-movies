import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { getMovie } from '../../api';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);

  function normalizeMovie(data: MovieData): Movie {
    const DEFAULT_ADDRESS =
      'https://via.placeholder.com/360x270.png?text=no%20preview';

    return {
      title: data.Title,
      description: data.Plot,
      imgUrl: data.Poster === 'N/A' ? DEFAULT_ADDRESS : data.Poster,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      imdbId: data.imdbID,
    };
  }

  function handleOnSubmit(event: React.FormEvent) {
    event?.preventDefault();

    setIsLoading(true);
    setError(null);
    setFoundMovie(null);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(data.Error);
          setFoundMovie(null);
        } else {
          const normalizedMovie = normalizeMovie(data);

          setFoundMovie(normalizedMovie);
        }
      })
      .catch(() => {
        // eslint-disable-next-line no-console
        console.error(`Something went wrong on connection`);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <form className="find-movie" onSubmit={handleOnSubmit}>
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
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                setError(null);
              }}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
            >
              {!foundMovie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAddMovie(foundMovie);
                  setQuery('');
                  setFoundMovie(null);
                }}
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
