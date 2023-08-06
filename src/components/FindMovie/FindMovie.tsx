import React, { useCallback, useMemo, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (data: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [loadingMovie, setLoadingMovie] = useState(false);
  const [hasError, setHasError] = useState(false);

  // eslint-disable-next-line max-len
  const deafultImage = useMemo(() => 'https://via.placeholder.com/360x270.png?text=no%20preview', []);

  const queryInputHandler = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setHasError(false);

    return (setQuery(event.target.value));
  }, []);

  const submitHandler = useCallback((
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();
    setLoadingMovie(true);

    getMovie(query)
      .then((data) => {
        if ('Error' in data) {
          return setHasError(true);
        }

        const poster = data.Poster === 'N/A' ? deafultImage : data.Poster;

        return setCurrentMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        });
      })
      .finally(() => setLoadingMovie(false));
  }, [query]);

  const addButtonHandler = useCallback(() => {
    if (currentMovie) {
      onAdd(currentMovie);
    }

    setQuery('');
    setCurrentMovie(null);
  }, [currentMovie]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={submitHandler}
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
              onChange={queryInputHandler}
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
                'button',
                'is-light',
                { 'is-loading': loadingMovie },
              )}
              disabled={!query}
            >
              {currentMovie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {currentMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addButtonHandler}
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
