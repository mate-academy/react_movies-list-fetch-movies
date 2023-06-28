import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { getMovie, getMovieData } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface FindMovieProps {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string | Error>('');
  const [isLoading, setIsLoading] = useState(false);

  const clearErrorMessage = () => {
    setError('');
  };

  const formattedQuery = query
    .replace(/\s{2,}/, ' ')
    .trim();

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setMovie(null);

    clearErrorMessage();
  };

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!formattedQuery) {
        setError('Enter the correct movie title!');

        return;
      }

      setIsLoading(true);

      try {
        const newMovie = await getMovie(formattedQuery);

        if ((newMovie as ResponseError).Response === 'False') {
          setError((newMovie as ResponseError).Error);
        }

        setMovie(getMovieData(newMovie as MovieData));
      } catch {
        setError('Error: fetching data from server!');

        setMovie(null);
      } finally {
        setIsLoading(false);
      }
    }, [query],
  );

  const handleAddMovie = () => {
    onAddMovie(movie as Movie);

    setQuery('');
    setMovie(null);
  };

  const isMovieFetched = !error && movie;

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              onChange={handleQueryChange}
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
              className={cn('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={!formattedQuery}
            >
              Find a movie
            </button>
          </div>

          {isMovieFetched && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>
      {isMovieFetched && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
