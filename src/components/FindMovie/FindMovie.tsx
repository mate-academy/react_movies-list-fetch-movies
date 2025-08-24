import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { defaultImageUrl } from '../../services/defaultImageUrl';

function getMovieFromData(data: MovieData): Movie {
  // eslint-disable-next-line max-len, prettier/prettier
  const defaultImage = defaultImageUrl;

  return {
    title: data.Title,
    description: data.Plot || '',
    imgUrl: data.Poster !== 'N/A' ? data.Poster : defaultImage,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

interface Props {
  addMovie: (newMovie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [loading, setLoading] = useState(false);

  function findMovie(event: React.FormEvent) {
    event.preventDefault();

    if (query) {
      setHasError(false);
      setLoading(true);

      getMovie(query)
        .then(data => {
          if (data.Response === 'True') {
            setMovie(getMovieFromData(data));
          } else {
            setHasError(true);
          }
        })
        .finally(() => setLoading(false));
    }
  }

  function processMovieAdding(event: React.FormEvent) {
    event.preventDefault();
    addMovie(movie as Movie);
    setQuery('');
    setMovie(null);
  }

  return (
    <>
      <form className="find-movie">
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
              onChange={e => {
                setQuery(e.target.value);

                if (hasError) {
                  setHasError(false);
                }
              }}
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
              onClick={findMovie}
              disabled={!query}
            >
              {query ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {!!movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={processMovieAdding}
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
