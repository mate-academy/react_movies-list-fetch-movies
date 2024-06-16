import React, { FormEvent, useCallback, useEffect, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

// eslint-disable-next-line max-len
const DEFAULT_IMAGE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

interface Props {
  onMovieAd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onMovieAd = () => {} }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => setError(false), [query]);

  const fetchMovie = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      getMovie(query)
        .then(movieFromServer => {
          if ('Error' in movieFromServer) {
            setError(true);
          } else {
            const {
              Title: title,
              Plot: description,
              Poster: imgUrl,
              imdbID: imdbId,
            } = movieFromServer;

            const image = imgUrl !== 'N/A' ? imgUrl : DEFAULT_IMAGE;

            setMovie({
              title,
              description,
              imgUrl: image,
              imdbId,
              imdbUrl: `https://www.imdb.com/title/${imdbId}`,
            });
          }
        })
        .finally(() => setIsLoading(false));
    },
    [query],
  );

  const reset = useCallback(() => {
    setQuery('');
    setMovie(null);
  }, []);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => {
          if (query !== '') {
            fetchMovie(event);
          }
        }}
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
              className={cn('input', {
                'is-danger': error,
              })}
              value={query}
              onChange={event => setQuery(event.target.value)}
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
              disabled={query === ''}
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
                  if (movie) {
                    onMovieAd(movie);
                    reset();
                  }
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
};
