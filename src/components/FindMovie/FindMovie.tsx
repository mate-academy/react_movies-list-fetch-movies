import React, { ChangeEvent, useCallback, useRef, useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';

type Props = {
  onMovieAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const [isQueryEmpty, setIsQueryEmpty] = useState(true);
  const [movie, setMovie] = React.useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const onQueryChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (isError) {
        setIsError(false);
      }

      const value = e.target.value;
      const shouldDisableButton = !value.trim();

      if (isQueryEmpty === shouldDisableButton) {
        return;
      }

      setIsQueryEmpty(shouldDisableButton);
    },
    [isQueryEmpty, isError],
  );

  const onFilmSearch = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      const query = inputRef.current?.value;

      if (!query) {
        return;
      }

      setIsLoading(true);
      getMovie(query)
        .catch(() => null)
        .then(response => {
          if (!response) {
            return;
          }

          if ('Title' in response) {
            setMovie({
              title: response.Title,
              description: response.Plot,
              imgUrl:
                response.Poster === 'N/A'
                  ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                  : response.Poster,
              imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
              imdbId: response.imdbID,
            });
          } else {
            setIsError(true);
          }
        })
        .finally(() => setIsLoading(false));
    },
    [],
  );

  const handleMovieAdd = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      event.preventDefault();

      if (!movie) {
        return;
      }

      onMovieAdd(movie);
      setMovie(null);
    },
    [movie, onMovieAdd],
  );

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
              className="input is-danger"
              ref={inputRef}
              onChange={onQueryChange}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={onFilmSearch}
              disabled={isQueryEmpty}
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
                onClick={handleMovieAdd}
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
