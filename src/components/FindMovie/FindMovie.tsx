import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  onQueryChange: (value: string) => void;
  onAdd: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ query, onQueryChange, onAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setError(false);
    getMovie(query)
      .then(response => {
        if ('Response' in response && response.Response === 'False') {
          setError(true);

          return;
        }

        const data = response as MovieData;

        const normalizedMovie: Movie = {
          title: data.Title,
          description: data.Plot,
          imgUrl:
            data.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
          imdbId: data.imdbID,
        };

        setPreviewMovie(normalizedMovie);
      })
      .finally(() => setIsLoading(false));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onQueryChange(e.target.value);
    setError(false);
  };

  const handleAdd = () => {
    if (previewMovie) {
      onAdd(previewMovie);
      onQueryChange('');
      setPreviewMovie(null);
    }
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
              className={`input ${error ? 'is-danger' : ''}`}
              value={query}
              onChange={handleInputChange}
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
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {previewMovie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                disabled={!previewMovie}
                onClick={handleAdd}
              >
                Add to the list
              </button>
            )}
          </div>
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
