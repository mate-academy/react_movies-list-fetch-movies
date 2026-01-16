import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { normalizeMovie } from '../../utils/normalizeMovie';

type Props = {
  movies: Movie[];
  onAddMovie: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ movies, onAddMovie }) => {
  const [title, setTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewMovie, setPreviewMovie] = useState<Movie | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim()) return;

    setIsLoading(true);
    setError('');
    setPreviewMovie(null);

    try {
      const response = await getMovie(title.trim());

      // Перевірка типу без кастів, TypeScript зрозуміє, що це MovieData
      if ('Response' in response && response.Response === 'False') {
        setError("Can't find a movie with such a title");
        return;
      }

      setPreviewMovie(normalizeMovie(response));
    } catch {
      setError('Unexpected error while fetching movie');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (!previewMovie) return;

    const exists = movies.some(movie => movie.imdbId === previewMovie.imdbId);

    if (!exists) {
      onAddMovie(prev => [...prev, previewMovie]);
    }

    // Після додавання видаляємо previewMovie, щоб кнопка Add зникла
    setPreviewMovie(null);
    setTitle('');
    setError('');
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
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
              onChange={handleTitleChange}
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
              disabled={!title.trim()}
            >
              Find a movie
            </button>
          </div>

          {/* Кнопка Add з’являється тільки якщо є previewMovie */}
          {previewMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddMovie}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {/* Попередній перегляд фільму */}
      {previewMovie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={previewMovie} />
        </div>
      )}
    </>
  );
};
