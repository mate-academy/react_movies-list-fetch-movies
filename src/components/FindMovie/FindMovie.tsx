import React, { useState, useEffect } from 'react';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

interface FindMovieProps {
  onAddMovie?: (movie: Movie) => void;
  existingMovies?: Movie[];
}

export const FindMovie: React.FC<FindMovieProps> = ({
  onAddMovie = () => {},
  existingMovies = [],
}) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const isTitleEmpty = title.trim() === '';

  useEffect(() => {
    setError('');
  }, [title]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (isTitleEmpty) {
      return;
    }

    setLoading(true);
    setError('');
    setMovie(null);

    try {
      const response = await getMovie(title);

      if ('Error' in response) {
        setError(response.Error);
      } else {
        const normalizedMovie: Movie = {
          title: response.Title,
          description: response.Plot,
          imgUrl:
            response.Poster === 'N/A'
              ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
              : response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        };

        setMovie(normalizedMovie);
      }
    } catch {
      setError('Unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleAddMovie = () => {
    if (movie) {
      // Перевіряємо, чи фільм вже є в списку
      const isMovieExists = existingMovies.some(m => m.imdbId === movie.imdbId);

      if (!isMovieExists) {
        onAddMovie(movie);
      }

      // Очищаємо форму в будь-якому випадку
      setTitle('');
      setMovie(null);
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
              className="input"
              value={title}
              onChange={e => setTitle(e.target.value)}
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
              disabled={isTitleEmpty || loading}
            >
              Find a movie
            </button>
          </div>

          {movie && (
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

      {movie && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
