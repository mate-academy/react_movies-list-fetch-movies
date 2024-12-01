// #region imports
import cn from 'classnames';
import React, { FormEvent, useRef, useState } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';
// #endregion

type Props = {
  onAdding: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdding }) => {
  const [query, setQuery] = useState('');
  const [findedMovie, setFindedMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);

  const searchButton = useRef<HTMLButtonElement>(null);

  const handleFindingMovie = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsError(false);
    searchButton.current?.classList.add('is-loading');

    const isResponseError = (
      response: MovieData | ResponseError,
    ): response is ResponseError => {
      return (response as ResponseError).Error !== undefined;
    };

    getMovie(query)
      .then(response => {
        if (isResponseError(response)) {
          setIsError(true);

          return;
        }

        const movie: Movie = {
          title: response.Title,
          description: response.Plot,
          imgUrl:
            response.Poster !== 'N/A'
              ? response.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setFindedMovie(movie);
      })
      .catch(() => {
        setIsError(true);
      })
      .finally(() => {
        searchButton.current?.classList.remove('is-loading');
      });
  };

  const handleAddingMovie = () => {
    if (!findedMovie) {
      return;
    }

    onAdding(findedMovie);
    setQuery('');
    setFindedMovie(null);
    setIsError(false);
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleFindingMovie}>
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
              ref={searchButton}
              data-cy="searchButton"
              type="submit"
              className="button is-light"
              disabled={!query}
            >
              {findedMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {findedMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddingMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {findedMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={findedMovie} />
        </div>
      )}
    </>
  );
};
