import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onSearch: (query: string) => Promise<void>;
  onAddMovie: (movie: Movie) => void;
  previewMovie: Movie | null;
  setPreviewMovie: (movie: Movie | null) => void;
  error: string | null;
  setError: (error: string | null) => void;
};

export const FindMovie: React.FC<Props> = ({
  onSearch,
  onAddMovie,
  previewMovie,
  setPreviewMovie,
  error,
  setError,
}) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setError(null);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      await onSearch(title.trim());
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unexpected error occurred',
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (previewMovie) {
      onAddMovie(previewMovie);
      setPreviewMovie(null);
      setTitle('');
    }
  };

  return (
    <form className="find-movie" onSubmit={handleSearch}>
      <div className="field">
        <label htmlFor="movie-title">Movie title</label>
        <input
          data-cy="titleField"
          id="movie-title"
          placeholder="Enter a title"
          className={`input ${error ? 'is-danger' : ''}`}
          value={title}
          onChange={handleInputChange}
        />
        {error && (
          <p data-cy="errorMessage" className="help is-danger">
            {error}
          </p>
        )}
      </div>

      <button
        data-cy="searchButton"
        type="submit"
        className={`button is-light ${isLoading ? 'is-loading' : ''}`}
        disabled={!title.trim() || isLoading}
      >
        Find a movie
      </button>

      {previewMovie && (
        <button
          data-cy="addButton"
          type="button"
          className="button is-primary"
          onClick={handleAddMovie}
        >
          Add to the list
        </button>
      )}

      {previewMovie && (
        <div data-cy="previewContainer">
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </form>
  );
};
