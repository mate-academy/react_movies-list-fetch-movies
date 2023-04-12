import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieData } from '../../types/MovieData';
import { MovieCard } from '../MovieCard';
import { getMovie, normalizeMovieData } from '../../api';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(false);
  const [movieData, setMovieData] = useState<MovieData | null>(null);

  const handleSubmit = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setIsLoading(true);

      getMovie(query.trim())
        .then((data) => {
          if ('Error' in data) {
            setError(true);
            setMovieData(null);
          } else {
            setMovieData(data);
            setError(false);
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }, [query],
  );

  const movie = movieData ? normalizeMovieData(movieData) : null;

  const handleAddMovie = useCallback(() => {
    if (movieData && movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovieData(null);
  }, [movieData, addMovie]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setError(false);
    setMovieData(null);
  }, []);

  const isDisable = query === '';

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
              className="input is-dander"
              value={query}
              onChange={handleChange}
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
              className={classNames('button', 'is-light', {
                'is-loading': isLoading,
              })}
              disabled={isDisable}
            >
              Find a movie
            </button>
          </div>

          {movieData && (
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

      {(movieData && movie) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>

          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
