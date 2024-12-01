import React, { useState } from 'react';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api';

import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';

import './FindMovie.scss';

const getImgUrl = (url: string) => {
  const DEFAULT_PICTURE
    = 'https://via.placeholder.com/360x270.png?text=no%20preview';

  return url === 'N/A'
    ? DEFAULT_PICTURE
    : url;
};

const normalizeMovieData = (movie: MovieData) => {
  const {
    Title,
    Plot,
    Poster,
    imdbID,
  } = movie;

  return {
    title: Title,
    description: Plot,
    imgUrl: getImgUrl(Poster),
    imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    imdbId: imdbID,
  };
};

type Props = {
  movies: Movie[],
  setMovies: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [foundMovie, setFoundMovie] = useState<MovieData | null>(null);

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);
      const response = await getMovie(query);

      if ('Response' in response && response.Response === 'False') {
        setHasError(true);
        setFoundMovie(null);
      } else {
        setHasError(false);
        setFoundMovie(response as MovieData);
      }
    } catch {
      setHasError(true);
      setFoundMovie(null);
    } finally {
      setIsLoading(false);
    }
  };

  const reset = () => {
    setFoundMovie(null);
    setQuery('');
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleAddButton = () => {
    if (
      movies
        .find(movie => movie.imdbId === foundMovie?.imdbID) === undefined
    ) {
      setMovies(normalizeMovieData(foundMovie as MovieData));
    }

    reset();
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
              className={classNames(
                'input',
                {
                  'is-danger': hasError,
                },
              )}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {hasError && (
            <p
              className="help is-danger"
              data-cy="errorMessage"
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
              className={classNames(
                'button is-light',
                {
                  'is-loading': isLoading,
                },
              )}
              disabled={!query.length}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
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

      {foundMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          {foundMovie && (
            <MovieCard
              movie={normalizeMovieData(foundMovie)}
            />
          )}
        </div>
      )}
    </>
  );
};
