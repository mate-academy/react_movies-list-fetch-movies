import React, { useCallback, useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { mapMovie } from '../../utils/mapMovie';

type Props = {
  onAddMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const showError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) {
      return;
    }

    setLoading(true);
    setMovie(null);
    setErrorMessage('');

    try {
      const data = await getMovie(query);

      if ('Response' in data && data.Response === 'False') {
        showError("Can't find a movie with such a title");
      } else {
        setMovie(mapMovie(data as MovieData));
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    if (!movie) {
      return;
    }

    onAddMovie(movie);

    setMovie(null);
    setQuery('');
    setErrorMessage('');
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
              type="text"
              id="movie-title"
              placeholder="Enter a title to query"
              value={query}
              onChange={e => {
                setQuery(e.target.value);
                if (errorMessage) {
                  setErrorMessage('');
                }
              }}
              className={cn('input', { 'is-danger': errorMessage })}
              data-cy="titleField"
            />
          </div>
          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className={cn('button is-light', { 'is-loading': loading })}
              disabled={!query.trim() || loading}
              data-cy="searchButton"
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                type="button"
                className="button is-primary"
                onClick={handleAdd}
                data-cy="addButton"
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
