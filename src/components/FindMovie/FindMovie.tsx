import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import { getMovie, getMovieData } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

interface FindMovieProps {
  error: string;
  onChangeError: (error: string) => void;
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<FindMovieProps> = ({
  error,
  onChangeError,
  onAddMovie,
}) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const clearErrorMessage = () => {
    onChangeError('');
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
        onChangeError('Enter the correct movie title!');

        return;
      }

      setIsLoading(true);

      try {
        const newMovie = await getMovie(formattedQuery);

        if ((newMovie as ResponseError).Response === 'False') {
          onChangeError((newMovie as ResponseError).Error);
        }

        setMovie(getMovieData(newMovie as MovieData));
      } catch {
        onChangeError('Error: fetching data from server!');

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
              {error}
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
