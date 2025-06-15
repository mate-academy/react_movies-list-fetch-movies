import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';

type Props = {
  query: string;
  setQuery: (query: string) => void;
  setError: (error: boolean) => void;
  error: boolean;
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({
  query,
  setQuery,
  setError,
  error,
  onAddMovie,
}) => {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
    setPreview(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = query.trim();

    if (!trimmed) {
      return;
    }

    setLoading(true);
    setError(false);
    setPreview(null);

    try {
      const data = await getMovie(query);

      if (data.Response === 'False') {
        setError(true);
        setPreview(null);
      } else {
        const movieData = data as MovieData;
        const movie: Movie = {
          title: movieData.Title,
          description: movieData.Plot || '',
          imgUrl:
            movieData.Poster !== 'N/A'
              ? movieData.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
          imdbUrl: `https://www.imdb.com/title/${movieData.imdbID}`,
          imdbId: movieData.imdbID,
        };

        setPreview(movie);
      }
    } catch {
      setError(true);
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (preview) {
      onAddMovie(preview);
      setQuery('');
      setPreview(null);
      setError(false);
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
              value={query}
              onChange={handleChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${error ? 'is-danger' : ''}`}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={query ? false : true}
            >
              Find a movie
            </button>
          </div>

          {preview && (
            <div className="control">
              <button
                onClick={handleAdd}
                data-cy="addButton"
                type="button"
                className="button is-primary"
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
