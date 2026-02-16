import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [preview, setPreview] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);

  const handleSearch = (event: React.FormEvent) => {
    event.preventDefault();

    // Zapobiegamy wysyłaniu pustych zapytań
    if (!query.trim()) {
      return;
    }

    setIsLoading(true);
    setError(false);
    setPreview(null); // Demo czyści stary podgląd przed nowym wyszukiwaniem

    getMovie(query)
      .then(result => {
        // Sprawdzamy pole Response z API OMDb
        if (result.Response === 'False') {
          setError(true);
          setPreview(null);
        } else {
          const normalizedMovie: Movie = {
            title: result.Title,
            description: result.Plot,
            // Dokładny adres URL wymagany przez testy Cypress
            imgUrl:
              result.Poster !== 'N/A'
                ? result.Poster
                : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbId: result.imdbID,
            imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
          };

          setPreview(normalizedMovie);
          setError(false);
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (preview) {
      onAdd(preview);
      // Reset wszystkiego po dodaniu (wymagane przez testy 3, 4 i 5)
      setPreview(null);
      setQuery('');
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
              onChange={({ target }) => {
                setQuery(target.value);
                if (error) {
                  setError(false);
                }

                if (preview) {
                  setPreview(null);
                }
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
              disabled={!query.trim() || isLoading}
              className={`button is-light ${isLoading ? 'is-loading' : ''}`}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {preview && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Kontener podglądu musi być renderowany warunkowo (Fix dla Cypress) */}
      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
