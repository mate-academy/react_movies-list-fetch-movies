import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import { ResponseError } from '../../types/ResponseError';

type Props = {
  onAdd: (movie: Movie) => void;
  existingMovies: Movie[];
};

function isMovieData(data: MovieData | ResponseError): data is MovieData {
  return (data as MovieData).imdbID !== undefined;
}

export const FindMovie: React.FC<Props> = ({
  onAdd = () => {},
  existingMovies = [],
}) => {
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<Movie | null>(null);

  const defaultPoster =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = await getMovie(title.trim());

      if (!isMovieData(data)) {
        setError(data.Error || 'Помилка при завантаженні');
        setPreview(null);
      } else {
        const movie: Movie = {
          imdbId: data.imdbID,
          title: data.Title,
          description: data.Plot || 'No description',
          imgUrl: data.Poster !== 'N/A' ? data.Poster : defaultPoster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
        };

        setPreview(movie);
      }
    } catch {
      setError('Помилка при завантаженні фільму');
      setPreview(null);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!preview) {
      return;
    }

    if (!existingMovies.some(m => m.imdbId === preview.imdbId)) {
      onAdd(preview);
    }

    setPreview(null);
    setTitle('');
    setError(null);
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
              onChange={e => {
                setTitle(e.target.value);
                setError(null);
              }}
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
