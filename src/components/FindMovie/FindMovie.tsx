import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onAdd: (movie: Movie) => void;
  movieList: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, movieList }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAdded, setIsAdded] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError('Enter a title to search');

      return;
    }

    setIsLoading(true);
    setError(null);
    setMovie(null);
    setIsAdded(false);

    try {
      const foundMovie = await getMovie(query);

      setMovie(foundMovie);
    } catch {
      setError("Can't find a movie with such a title");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    if (movie) {
      const isAlreadyAdded = movieList.some(m => m.imdbId === movie.imdbId);

      if (!isAlreadyAdded) {
        onAdd(movie);
      }

      setError(null);
      setMovie(null);
      setQuery('');
      setIsAdded(true);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    if (error) {
      setError(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSearch}>
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
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
              disabled={!query.trim() || isLoading}
            >
              Find a movie
            </button>
          </div>

          {movie && !isAdded && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
                disabled={!movie}
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
