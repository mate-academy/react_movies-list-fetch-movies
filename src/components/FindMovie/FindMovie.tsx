import React, { useState } from 'react';
import './FindMovie.scss';
import cn from 'classnames';
import { getMovie } from '../../api';
import type { Movie } from '../../types/Movie';
import type { MovieData } from '../../types/MovieData';
import type { ResponseError } from '../../types/ReponseError';
import { MovieCard } from '../MovieCard';

type Props = {
  movies: Movie[];
  onAdd: (movie: Movie) => void;
};

const DEFAULT_IMG_URL =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

// type guard better?
function isResponseError(
  data: MovieData | ResponseError,
): data is ResponseError {
  return 'Response' in data && data.Response === 'False';
}

function normalizeMovie(data: MovieData) {
  const hasPoster = data.Poster !== 'N/A' && data.Poster !== '';

  return {
    title: data.Title,
    description: data.Plot,
    imgUrl: hasPoster ? data.Poster : DEFAULT_IMG_URL,
    imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    imdbId: data.imdbID,
  };
}

export const FindMovie: React.FC<Props> = ({ movies, onAdd }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setHasError(false);
    setPreviewMovie(null);

    try {
      const data = await getMovie(title.trim());

      if (isResponseError(data)) {
        setHasError(true);

        return;
      }

      setPreviewMovie(normalizeMovie(data));
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setHasError(false);
  };

  const handleAdd = () => {
    if (!previewMovie) {
      return;
    }

    if (!movies.some(movie => movie.imdbId === previewMovie.imdbId)) {
      onAdd(previewMovie);
    }

    setTitle('');
    setPreviewMovie(null);
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
              className={cn('input', { 'is-danger': hasError })}
              value={title}
              onChange={handleTitleChange}
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
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          {previewMovie && (
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

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
