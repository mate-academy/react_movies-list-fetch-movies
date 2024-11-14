import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  onSearch: (query: string) => void;
  onAddMovie: (movie: Movie) => void;
  previewMovie: Movie | null;
  setPreviewMovie: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ onSearch, onAddMovie, previewMovie, setPreviewMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    if (error) setError(null);
  };

  const handleSearch = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      await onSearch(title.trim());
    } catch {
      setError("An unexpected error occurred.");
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
        <label className="label" htmlFor="movie-title">Movie title</label>
        <div className="control">
          <input
            data-cy="titleField"
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            className={`input ${error ? 'is-danger' : ''}`}
            value={title}
            onChange={handleInputChange}
          />
        </div>
        {error && (
          <p className="help is-danger" data-cy="errorMessage">
            {error}
          </p>
        )}
      </div>

      <div className="field is-grouped">
        <div className="control">
          <button
            data-cy="searchButton"
            type="submit"
            className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            disabled={!title.trim() || isLoading}
          >
            Find a movie
          </button>
        </div>

        {previewMovie && (
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        )}
      </div>

      {previewMovie && (
        <div className="preview">
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </form>
  );
};
