import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { mapMovieData } from '../../utils/mapMovieData';

type Props = {
  onMovieAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (hasError) {
      setHasError(false);
    }

    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setHasError(false);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setHasError(true);
          setMovie(null);

          return;
        }

        setMovie(mapMovieData(data));
      })
      .catch(() => {
        setHasError(true);
        setMovie(null);
      })
      .finally(() => setIsLoading(false));
  };

  const handleMovieAdd = () => {
    if (movie) {
      onMovieAdd(movie);
      setMovie(null);
      setQuery('');
    }
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
              value={query}
              onChange={handleQueryChange}
              className={cn('input', { 'is-danger': hasError })}
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
              className={cn('button', 'is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              {movie ? 'Search again' : 'Find a movie'}
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
