import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { normalizeMovie } from '../../helpers/normalizeMovie';

type Props = {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
};

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [query, setQuery] = useState('');
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoadingData, setIsLoadingData] = useState(false);

  const handleQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = event.target.value;

    setHasError(false);
    setQuery(newQuery);
  };

  const handleSearch = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const normalizedQuery = query.trim().toLowerCase();

    setIsLoadingData(true);

    getMovie(normalizedQuery)
      .then((movieFromServer) => {
        if ('Error' in movieFromServer) {
          setHasError(true);
        } else {
          setMovie(normalizeMovie(movieFromServer));
          console.log(normalizeMovie(movieFromServer));
        }
      })
      .catch(() => {
        setHasError(true);
      })
      .finally(() => setIsLoadingData(false));
  };

  const handleAddToList = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    if (movie) {
      const newIMDB = movie.imdbId;

      if (!movies.find((mov) => mov.imdbId === newIMDB)) {
        const newChosenMovies = [...movies, movie];

        setMovies(newChosenMovies);
      }

      setMovie(null);
      setQuery('');
    }
  };

  return (
    <>
      <form className="find-movie">
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
              className={classNames('input', { 'is-danger': hasError })}
              value={query}
              onChange={handleQuery}
            />
          </div>

          {hasError && (
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoadingData,
              })}
              disabled={!query}
              onClick={handleSearch}
            >
              {movie ? 'Search again' : 'Find a movie'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleAddToList}
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
