import cn from 'classnames';
import React, { useState } from 'react';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { normalizeMovieData } from '../../services/normalizeMovieData';
import { MovieCard } from '../MovieCard';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';

type Props = {
  onAdd: (newMovie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setIsError(false);
  };

  const handleMovieSearch = (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);

    getMovie(query)
      .then(res => {
        if (Object.hasOwn(res, 'Error')) {
          throw new Error();
        }

        setMovie(normalizeMovieData(res as MovieData));
      })
      .catch(() => setIsError(true))
      .finally(() => {
        setIsLoading(false);
        setQuery('');
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      onAdd(movie);
    }

    setMovie(null);
  };

  const btnText = movie ? 'Search again' : 'Find a movie';

  return (
    <>
      <form className="find-movie" onSubmit={handleMovieSearch}>
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
              value={query}
              onChange={handleInputChange}
            />
          </div>

          {isError && (
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
              className={cn('button is-light', { 'is-loading': isLoading })}
              disabled={!query.trim()}
            >
              {btnText}
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
