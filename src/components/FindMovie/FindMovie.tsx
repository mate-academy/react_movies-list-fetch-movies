import cn from 'classnames';
import React, {
  ChangeEvent,
  FormEvent,
  useState,
} from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { normalizeMovie } from '../../helpers/normalizeMovie';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>();
  const [isLoading, setIsLoading] = useState(false);
  const [onloadError, setOnloadError] = useState('');

  const handleSearchChange = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    setOnloadError('');
    setQuery(event.target.value);
  };

  const handleFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = await getMovie(query.trim());

      if ('Error' in data) {
        setOnloadError(data.Error);
      } else {
        const preparedMovieData = normalizeMovie(data);

        setPreviewMovie(preparedMovieData);
      }
    } catch (error) {
      setOnloadError('Unexpected error, please retry');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (previewMovie) {
      onAddMovie(previewMovie);
    }

    setQuery('');
    setPreviewMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
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
              value={query}
              className={cn('input', {
                'is-danger': onloadError,
              })}
              onChange={handleSearchChange}
            />
          </div>

          {onloadError && (
            <p className="help is-danger" data-cy="errorMessage">
              {onloadError}
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
              disabled={!query.trim()}
            >
              {previewMovie
                ? 'Search again'
                : 'Find a movie'}
            </button>
          </div>

          {previewMovie && (
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

      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
