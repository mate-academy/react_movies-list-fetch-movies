import React, { ChangeEvent, FormEvent, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { isResponseOk, normalizeMovieData } from '../utils/functions';
import { Movie } from '../../types/Movie';

type Props = {
  query: string;
  setSearchQuery: (value: string) => void;
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = (
  {
    query,
    setSearchQuery,
    addMovie,
  },
) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [responseError, setResponseError]
    = useState(false);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [isLoaded, setIsLoaded] = useState(true);

  const reset = () => {
    setResponseError(false);
    setHasLoadingError(false);
  };

  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    reset();

    const { value } = event.target;

    setSearchQuery(value);
  };

  const findMovie = async (searchQuery: string) => {
    try {
      setIsLoaded(false);

      const movieDataFromServer = await getMovie(searchQuery);

      if (isResponseOk(movieDataFromServer)) {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        const newMovie = normalizeMovieData(movieDataFromServer as MovieData);

        setMovie(newMovie);
      } else {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        setResponseError(true);
      }
    } catch {
      setHasLoadingError(true);
    } finally {
      setIsLoaded(true);
    }
  };

  const handleAddButtonClick = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    addMovie(movie!);
    setMovie(null);
    setSearchQuery('');
    reset();
  };

  const onFindButtonClick = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    findMovie(query);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFindButtonClick}
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
              onChange={changeQuery}
            />
          </div>

          {responseError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {hasLoadingError && (
            <p className="help is-danger">
              Can&apos;t load data from server
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
                  'is-loading': !isLoaded,
                },
              )}
              disabled={query.length === 0}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddButtonClick()}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          {/* eslint-disable-next-line @typescript-eslint/no-non-null-assertion */}
          <MovieCard movie={movie!} />
        </div>
      )}
    </>
  );
};
