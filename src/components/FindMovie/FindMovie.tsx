import React, { useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

const DEFAULT_PICTURE = 'https://via.placeholder.com'
  + '/360x270.png?text=no%20preview';

const EMPTY_PICTURE_TEXT = 'N/A';

type Props = {
  query: string,
  onSearch: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ query, onSearch, onAdd }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<ResponseError | null>(null);

  const [isTouched, setIsTouched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isFound, setIsFound] = useState(false);

  const hasError = Boolean(error || (!query && isTouched));

  const checkIfResponse = (response: ResponseError | MovieData):
    response is MovieData => {
    if ((response as ResponseError).Error) {
      return false;
    }

    return true;
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    if (query) {
      getMovie(query)
        .then((foundMovie) => {
          if (checkIfResponse(foundMovie)) {
            const {
              Title,
              Poster,
              Plot,
              imdbID,
            } = foundMovie;

            setMovie({
              title: Title,
              description: Plot,
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
              imgUrl: Poster === EMPTY_PICTURE_TEXT
                ? DEFAULT_PICTURE
                : Poster,
            });
            setIsFound(true);

            return;
          }

          setError(foundMovie);
          setIsFound(false);
        }).finally(() => setIsLoading(false));
    }
  };

  useEffect(() => {
    setError(null);
  }, [query]);

  const handleAddToList = (newMovie: Movie) => {
    onAdd(newMovie);
    setIsFound(false);
    setIsTouched(false);
    setError(null);
    setMovie(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsTouched(true);
    onSearch(event);
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
                'is-danger': error,
              })}
              value={query}
              onChange={handleSearch}
            />
          </div>
          {error && (
            <p className="help is-danger" data-cy="errorMessage">
              {error.Error}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={hasError || !isTouched}
            >
              {isFound ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>
          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddToList(movie)}
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
