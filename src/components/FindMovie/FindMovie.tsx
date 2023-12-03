import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

type Props = {
  onMovieAdd: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [count, setCount] = useState(0);

  const onQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setHasError(false);
  };

  const handleFind = (event: React.FormEvent) => {
    event.preventDefault();
    setCount(prev => prev + 1);
    setIsLoading(true);
    getMovie(query)
      .then(response => {
        if ('Error' in response) {
          setHasError(true);
        } else {
          setMovie({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
            imdbId: response.imdbID,
          });
        }
      })
      .catch(() => setHasError(true))
      .finally(() => setIsLoading(false));
  };

  const handleMovieAdd = () => {
    setQuery('');
    setHasError(false);
    setCount(0);
    onMovieAdd(movie as Movie);
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFind}
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
              className={cn('input', { 'is-danger': hasError })}
              value={query}
              onChange={onQueryChange}
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
              className={cn(
                'button is-light',
                { 'is-loading': isLoading },
              )}
              onClick={() => handleFind}
              disabled={!query}
            >
              {count === 0 ? 'Find a movie' : 'Search again'}
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
