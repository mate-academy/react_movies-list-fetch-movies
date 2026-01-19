import React from 'react';
import './FindMovie.scss';

import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import cn from 'classnames';
import { normalizeMovie } from '../../normalizeMovie';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  setQuery: (value: string) => void;
  hasQueryErrorMessage: string;
  setHasQueryErrorMessage: (error: string) => void;
  currentMovie: Movie | null;
  setCurrentMovie: (movie: Movie | null) => void;
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
  loading: boolean;
  setLoading: (load: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  hasQueryErrorMessage,
  setHasQueryErrorMessage,
  currentMovie,
  setCurrentMovie,
  movies,
  setMovies,
  loading,
  setLoading,
}) => {
  // console.log(query);

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setHasQueryErrorMessage('');
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setHasQueryErrorMessage(data.Error);
          setCurrentMovie(null);

          return;
        }

        setCurrentMovie(normalizeMovie(data));
      })
      .finally(() => setLoading(false));
  };

  const onClear = () => {
    setQuery('');
  };

  const handleAddMovieInList = (movie: Movie | null) => {
    if (!movie) {
      return;
    }

    // проверяем, есть ли фильм в списке
    const exists = movies.some(m => m.imdbId === movie.imdbId);

    if (exists) {
      setCurrentMovie(null);
      setQuery('');

      return;
    }

    // добавляем новый фильм
    setMovies([...movies, movie]);

    // очищаем превью и инпут
    setCurrentMovie(null);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <p className="control is-expanded has-icons-right">
              <input
                data-cy="titleField"
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={cn('input', { 'is-danger': hasQueryErrorMessage })}
                value={query}
                onChange={handleQueryChange}
              />

              {query && (
                <span
                  className="icon is-right"
                  style={{ pointerEvents: 'all' }}
                >
                  <button
                    data-cy="clearSearchButton"
                    type="button"
                    className="delete"
                    onClick={onClear}
                  />
                </span>
              )}
            </p>
          </div>

          {hasQueryErrorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {hasQueryErrorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              disabled={!query}
              data-cy="searchButton"
              type="submit"
              className={cn('button', 'is-light', { 'is-loading': loading })}
            >
              {!loading && 'Find a movie'}
              {/* Find a movie */}
            </button>
          </div>

          {currentMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovieInList(currentMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {currentMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
