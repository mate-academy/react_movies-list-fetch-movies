import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import cn from 'classnames';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';

interface Props {
  onMovieAdd: (movie: Movie) => void;
  movies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ onMovieAdd, movies }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    setQuery(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (query) {
      setIsLoading(true);
      getMovie(query)
        .then(response => {
          if ('Error' in response) {
            setError(response.Error);
          } else {
            const baseUrl = 'https://www.imdb.com/title/';

            const normalizedMovie = {
              title: response?.Title || '',
              description: response?.Plot || '',
              imgUrl: response?.Poster || '',
              imdbUrl: baseUrl + response?.imdbID || '',
              imdbId: response?.imdbID || '',
            };

            setMovie(normalizedMovie);
          }
        })
        .finally(() => setIsLoading(false));
    }
  };

  const handleMovieAdd = () => {
    if (movie) {
      const coincidence = movies.some(el => el.imdbId === movie.imdbId);

      if (!coincidence) {
        onMovieAdd(movie);
      }

      setQuery('');
      setMovie(null);
    }
  };

  const isSubmitButtonDisabled = query === '';

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={query}
              onChange={handleInputChange}
              data-cy="titleField"
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': false })}
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
              disabled={isSubmitButtonDisabled}
              data-cy="searchButton"
              type="submit"
              className={cn('button is-light', { 'is-loading': isLoading })}
              onClick={handleSubmit}
            >
              {!movie && 'Find a movie'}
              {movie && 'Search again'}
            </button>
          </div>

          <div className="control">
            {movie && (
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
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
