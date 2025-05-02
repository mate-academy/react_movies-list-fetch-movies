import React, { FormEvent, useState, useCallback } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';

const PLACEHOLDER_IMAGE =
  'https://via.placeholder.com/360x270.png?text=no%20preview';

type FindMovieProps = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<FindMovieProps> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);
  const [hasError, setHasError] = useState(false);

  const convertMovieData = useCallback((data: MovieData): Movie => {
    const hasValidPoster = data.Poster && data.Poster !== 'N/A';
    const imgUrl = hasValidPoster ? data.Poster : PLACEHOLDER_IMAGE;

    return {
      title: data.Title,
      description: data.Plot,
      imgUrl,
      imdbId: data.imdbID,
      imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
    };
  }, []);

  const resetForm = useCallback(() => {
    setQuery('');
    setPreviewMovie(null);
    setHasError(false);
  }, []);

  const handleError = useCallback(() => {
    setHasError(true);
    setPreviewMovie(null);
  }, []);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      return;
    }

    setIsLoading(true);
    setHasError(false);

    try {
      const data = await getMovie(trimmedQuery);

      if (!data || !('Title' in data && 'Plot' in data && 'imdbID' in data)) {
        handleError();

        return;
      }

      setPreviewMovie(convertMovieData(data));
    } catch (error) {
      handleError();
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (!previewMovie) {
      return;
    }

    onAddMovie(previewMovie);
    resetForm();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);

    if (hasError) {
      setHasError(false);
    }
  };

  const isSearchDisabled = !query.trim() || isLoading;

  return (
    <div className="find-movie-container">
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
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {hasError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can not find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              disabled={isSearchDisabled}
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
        <div className="preview-container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={previewMovie} />
        </div>
      )}
    </div>
  );
};
