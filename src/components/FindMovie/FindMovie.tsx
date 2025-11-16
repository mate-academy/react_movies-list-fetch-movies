import React, { useState } from 'react';
import './FindMovie.scss';

import { getMovie } from '../../api';
import { mapMovieData } from '../../utils/mapMovieData';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (movie: Movie) => void;
  existing: Movie[];
};

export const FindMovie: React.FC<Props> = ({ onAdd, existing }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<Movie | null>(null);

  function isResponseError(
    data: MovieData | ResponseError,
  ): data is ResponseError {
    return 'Response' in data && data.Response === 'False';
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError('');
    setPreview(null);

    try {
      const data = await getMovie(title.trim());

      if (isResponseError(data)) {
        setError(data.Error || "Can't find a movie with such a title");

        return;
      }

      const movie = mapMovieData(data);

      setPreview(movie);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    const exists = existing.some(m => m.imdbId === preview.imdbId);

    if (!exists) {
      onAdd(preview);
    }

    setTitle('');
    setPreview(null);
  };

  const handleChangeTitle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setError('');
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
              value={title}
              onChange={handleChangeTitle}
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
              className={`button is-light ${loading ? 'is-loading' : ''}`}
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          {preview && (
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

      {preview && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={preview} />
        </div>
      )}
    </>
  );
};
