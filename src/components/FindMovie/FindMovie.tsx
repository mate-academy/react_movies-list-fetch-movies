import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const reset = () => {
    setQuery('');
    setMovie(null);
  };

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(false);
    setMovie(null);

    getMovie(query)
      .then(data => {
        if ('Error' in data || data.Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        const normalizedMovie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster !== 'N/A'
              ? data.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };

        setMovie(normalizedMovie);
        setError(false);
      })
      .catch(() => setError(true))
      .finally(() => setIsLoading(false));
  };

  const handleAdd = () => {
    if (movie) {
      onAdd(movie);
      reset();
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
              onChange={event => {
                setQuery(event.target.value);
                setError(false);
              }}
            />
          </div>

          {error && (
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
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
              disabled={!query.trim()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!movie}
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
