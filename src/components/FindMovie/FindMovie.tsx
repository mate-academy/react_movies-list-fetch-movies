import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type Props = {
  addMovie: (newMovie: Movie | undefined) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie>();
  const [loading, setLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');

  const handleFindMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.trim() === '') {
      return;
    }

    setLoading(true);
    getMovie(query)
      .then(response => {
        if ((response as ResponseError).Response === 'False') {
          setHasError(true);

          return;
        }

        const responseMovie = response as MovieData;

        setMovie({
          title: responseMovie.Title,
          description: responseMovie.Plot,
          imgUrl:
            responseMovie.Poster === 'N/A'
              ? PLACEHOLDER_IMAGE
              : responseMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${responseMovie.imdbID}`,
          imdbId: responseMovie.imdbID,
        });
      })
      .finally(() => setLoading(false));
  };

  const handleAddMovie = () => {
    addMovie(movie);
    setQuery('');
    setMovie(undefined);
  };

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setQuery(event.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindMovie}>
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
              onChange={handleQuery}
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
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
