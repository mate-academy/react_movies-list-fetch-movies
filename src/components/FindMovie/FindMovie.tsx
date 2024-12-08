import React, { useState, useCallback } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';
import cn from 'classnames';

type Props = {
  onHandleAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = React.memo(({ onHandleAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;

      setQuery(value);
      setError(false);
    },
    [],
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      setIsLoading(true);
      setError(false);

      getMovie(query.toLowerCase().trim())
        .then((data: MovieData | ResponseError) => {
          if ('Error' in data) {
            setError(true);
            setMovie(null);

            return;
          }

          setMovie({
            title: data.Title,
            imdbId: data.imdbID,
            description: data.Plot,
            imgUrl:
              data.Poster !== 'N/A'
                ? data.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          });
        })
        .catch(() => {
          setError(true);
          setMovie(null);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
    [query],
  );

  return (
    <>
      <form className="find-movie" onSubmit={e => handleSubmit(e)}>
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
              onChange={handleInputChange}
            />
          </div>

          {error && (
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
              className={cn('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={!query}
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
                  onHandleAdd(movie);
                  setMovie(null);
                  setQuery('');
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
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
});
