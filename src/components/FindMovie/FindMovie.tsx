import React, { useState } from 'react';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';

import { getMovie } from '../../api';

type Props = {
  addMovie: (newMovie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);

  const handleSearchMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsLoading(true);

    getMovie(query.trim())
      .then(result => {
        if ((result as ResponseError).Error) {
          setHasLoadingError(true);
        } else {
          const {
            Title,
            Plot,
            imdbID,
            Poster,
          } = result as MovieData;

          setMovie({
            title: Title,
            description: Plot,
            imdbId: imdbID,
            imdbUrl: `https://www.imdb.com/title/${imdbID}`,
            imgUrl: Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : Poster,
          });
        }
      })
      .finally(() => setIsLoading(false));
  };

  const handleChangeQuery = (value: string) => {
    setQuery(value);
    setHasLoadingError(false);
  };

  const handleAddToTheList = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
    setQuery('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSearchMovie}
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
              onChange={(e) => handleChangeQuery(e.target.value)}
            />
          </div>

          {hasLoadingError && (
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
              disabled={!query.trim()}
              className={classNames(
                'button',
                'is-light',
                {
                  'is-loading': isLoading,
                },
              )}
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
                onClick={handleAddToTheList}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">
            Preview
          </h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
