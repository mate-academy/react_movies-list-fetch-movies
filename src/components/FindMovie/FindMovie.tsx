import React, { useEffect } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

import { Movie } from '../../types/Movie';

interface Props {
  query: string;
  setQuery: (query: string) => void;
  movie: Movie | null;
  setMovie: (movie: Movie | null) => void;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  isSubmitted: boolean;
  setIsSubmitted: (isFetching: boolean) => void;
  showError: boolean;
  setShowError: (showError: boolean) => void;
}

export const FindMovie: React.FC<Props> = ({
  query, setQuery, movie, setMovies, movies, setIsSubmitted, isSubmitted,
  setMovie, showError, setShowError,

}) => {
  useEffect(() => {
    setShowError(false);
  }, [query]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitted(true);
  };

  const handleAdd = () => {
    if (movie) {
      setMovies([...movies, movie]);

      if (movies.length
        && movies.some(({ imdbId }) => movie.imdbId === imdbId)) {
        setMovies(movies);
      }
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(e) => handleSubmit(e)}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              data-cy="titleField"
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-dander"
            />
          </div>

          {showError && (
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
              className={classNames({
                'button is-light': !isSubmitted,
                'button is-light is-loading': isSubmitted,
              })}
              disabled={!query.length}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
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
