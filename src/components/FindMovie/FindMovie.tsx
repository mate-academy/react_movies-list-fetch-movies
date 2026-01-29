import React, { useEffect, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type MovieCardProps = {
  setMovies: (movie: Movie) => void;
};

function normalizeMovieData(movie: MovieData): Movie {
  return {
    title: movie.Title,
    description: movie.Plot,
    imgUrl:
      movie?.Poster === 'N/A'
        ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
        : movie.Poster,
    imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
    imdbId: movie.imdbID,
  };
}

const isResponseError = (
  movieSearched: MovieData | ResponseError | undefined | null,
): movieSearched is ResponseError => {
  return (
    !!movieSearched &&
    'Response' in movieSearched &&
    movieSearched.Response === 'False'
  );
};

export const FindMovie: React.FC<MovieCardProps> = ({ setMovies }) => {
  const [query, setQuery] = useState<string>('');
  const [movieData, setMovieData] = useState<MovieData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasError, setHasError] = useState<boolean>(false);
  const [searchButtonMessage, setSearchButtonMessage] =
    useState<string>('Find a movie');

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const result = await getMovie(query).finally(() => setLoading(false));

    if (isResponseError(result)) {
      setHasError(true);
    } else {
      setMovieData(result);
      setSearchButtonMessage('Search again');
      setHasError(false);
    }
  };

  const handleAddTitle = () => {
    setSearchButtonMessage('Find a movie');
    setQuery('');
    if (movieData) {
      setMovies(normalizeMovieData(movieData));
    }
  };

  useEffect(() => {
    setHasError(false);
    setMovieData(null);
  }, [query]);

  return (
    <>
      <form className="find-movie" onSubmit={event => handleFormSubmit(event)}>
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
              onChange={event => setQuery(event.target.value)}
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
              disabled={query === ''}
            >
              {searchButtonMessage}
            </button>
          </div>

          {!hasError && !!movieData && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddTitle}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {!hasError && movieData !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={normalizeMovieData(movieData)} />
        </div>
      )}
    </>
  );
};
