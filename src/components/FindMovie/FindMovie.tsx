import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  function handlerSubmit(submitEvent: React.FormEvent<HTMLFormElement>) {
    submitEvent.preventDefault();
    setIsLoading(true);
    setHasError(false);
    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setHasError(true);
        } else {
          const normalizedMovie = {
            title: data.Title,
            description: data.Plot,
            imdbId: data.imdbID,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imgUrl:
              data.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : data.Poster,
          };

          setPreview(normalizedMovie);
        }
      })
      .finally(() => setIsLoading(false));
  }

  function handlerClick() {
    if (preview) {
      onAdd(preview);
      setQuery('');
      setPreview(null);
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={handlerSubmit}>
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
              onChange={event => {
                setHasError(false);
                setQuery(event.target.value);
              }}
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query}
            >
              {!preview ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          <div className="control">
            {preview && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handlerClick()}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
