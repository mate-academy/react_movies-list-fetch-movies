import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';

import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onAdd: (movie: Movie) => void
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const findHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    getMovie(query)
      .then(res => {
        if ('Error' in res) {
          setIsError(true);

          return;
        }

        setMovie({
          title: res.Title,
          description: res.Plot,
          imgUrl: res.Poster === 'N/A'
            ? 'https://via.placeholder.com/'
              + '360x270.png?text=no%20preview'
            : (res.Poster),
          imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
          imdbId: res.imdbID,
        });
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findHandler}
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
              onChange={e => {
                setIsError(false);
                setQuery(e.target.value);
              }}
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
              className={classNames(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              disabled={(!query.length)}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => {
                  onAdd(movie);
                  setQuery('');
                  setMovie(null);
                }}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard
            movie={movie}
          />
        </div>
      )}
    </>
  );
};
