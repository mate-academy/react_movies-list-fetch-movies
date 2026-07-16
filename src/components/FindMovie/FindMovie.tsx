import React, { useState } from 'react';
import cn from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  onAdd: (movie: Movie) => void;
  savedMovies: Movie[];
}

export const FindMovie: React.FC<Props> = ({ onAdd, savedMovies }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [moviePreview, setMoviePreview] = useState<Movie | null>(null);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(false);
    setMoviePreview(null);

    getMovie(query)
      .then(data => {
        if ('Error' in data) {
          setError(true);
        } else {
          const normalizedMovie = {
            title: data.Title,
            description: data.Plot,
            imgUrl:
              data.Poster === 'N/A'
                ? 'https://via.placeholder.com/360x270.png?text=no%20preview'
                : data.Poster,
            imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
            imdbId: data.imdbID,
          };

          setMoviePreview(normalizedMovie);
        }
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAdd = () => {
    if (!moviePreview) {
      return;
    }

    const isAlreadySaved = savedMovies.some(savedMovie => {
      return savedMovie.imdbId === moviePreview.imdbId;
    });

    if (!isAlreadySaved) {
      onAdd(moviePreview);
    }

    setQuery('');
    setMoviePreview(null);
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
              className={cn('input', error && 'is-danger')}
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
              className={cn('button', 'is-light', isLoading && 'is-loading')}
              disabled={query === ''}
            >
              Find a movie
            </button>
          </div>

          {moviePreview !== null && (
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

      {moviePreview !== null && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={moviePreview} />
        </div>
      )}
    </>
  );
};
