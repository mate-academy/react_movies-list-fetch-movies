import React, { useCallback, useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';
import { getMovie, preparedMovieData } from '../../api';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { ResponseError } from '../../types/ReponseError';
import { MovieData } from '../../types/MovieData';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [query, setQuery] = useState('');

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
    setMovie(null);
  };

  const handleSubmit = useCallback(async (
    event: React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!query.trim()) {
      setErrorMessage('Enter the movie title');
      setMovie(null);

      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const newMovie = await getMovie(query);

      if ((newMovie as ResponseError).Response === 'False') {
        setErrorMessage((newMovie as ResponseError).Error);
      }

      setMovie(preparedMovieData(newMovie as MovieData));
    } catch {
      setErrorMessage('Fail with fetching data');
      setMovie(null);
    } finally {
      setIsLoading(false);
    }
  }, [query]);

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
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
              className={classNames('input', { 'is-danger': errorMessage })}
              value={query}
              onChange={handleTitleChange}
            />
          </div>

          {errorMessage && (
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
              disabled={!query}
            >
              Find a movie
            </button>
          </div>

          {movie && !errorMessage && (
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

      {movie && !errorMessage && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
