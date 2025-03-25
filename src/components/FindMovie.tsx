import React from 'react';
import { Movie } from '../types/Movie';
import { MovieCard } from './MovieCard';
import { useMovieSearch } from '../hooks/useMovieSearch';
import './FindMovie.scss';

interface Props {
  onAdd: (movie: Movie) => void;
  movies?: Movie[];
}

export const FindMovie: React.FC<Props> = ({ onAdd, movies = [] }) => {
  const {
    title,
    setTitle,
    isLoading,
    error,
    foundMovie,
    handleSearch,
    clearSearch,
  } = useMovieSearch();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(title);
  };

  const handleAdd = () => {
    if (foundMovie) {
      const isDuplicate = movies.some(m => m.imdbId === foundMovie.imdbId);

      if (!isDuplicate) {
        onAdd(foundMovie);
      }

      clearSearch();
    }
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  };

  return (
    <div className="find-movie">
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={handleTitleChange}
          placeholder="Enter movie title"
          className="find-movie__input"
          data-cy="titleField"
        />
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className={`find-movie__button ${isLoading ? 'is-loading' : ''}`}
          data-cy="searchButton"
        >
          Find
        </button>
      </form>

      {error && (
        <div className="find-movie__error" data-cy="errorMessage">
          {error}
        </div>
      )}

      {foundMovie && (
        <div className="find-movie__preview" data-cy="previewContainer">
          <MovieCard movie={foundMovie} />
          <button
            onClick={handleAdd}
            className="find-movie__add"
            data-cy="addButton"
          >
            Add to list
          </button>
        </div>
      )}
    </div>
  );
};
