import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { convertData, getMovie } from '../../api';

interface Props {
  movies: Movie[];
  setMovies: (movies: Movie[]) => void;
}

export const FindMovie: React.FC<Props> = ({ movies, setMovies }) => {
  const [inputValue, setInputValue] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showError, setShowError] = useState(false);

  const handleAddMovie = useCallback((newMovie: Movie) => {
    if (!movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      setMovies([...movies, newMovie]);
    }

    setInputValue('');
    setFoundMovie(null);
  }, [movies, setMovies]);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      if (showError) {
        setShowError(false);
      }

      setInputValue(event.target.value);
    },
    [showError],
  );

  const handleFormSubmit = useCallback(
    (event: React.FormEvent) => {
      event.preventDefault();
      setIsLoading(true);
      getMovie(inputValue)
        .then((data) => {
          if ('Error' in data) {
            throw new Error();
          }

          return data;
        })
        .then(convertData)
        .then(setFoundMovie)
        .catch(() => {
          setShowError(true);
        })
        .finally(() => setIsLoading(false));
    },
    [inputValue],
  );

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleFormSubmit}
      >
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
              className={classNames('input', {
                'is-danger': showError,
              })}
              value={inputValue}
              onChange={handleInputChange}
            />
          </div>

          {showError && (
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
              disabled={!inputValue}
            >
              Find a movie
            </button>
          </div>

          {foundMovie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAddMovie(foundMovie)}
              >
                Add to the list
              </button>
            </div>
          )}
        </div>
      </form>

      {(foundMovie) && (
        <div className="container" data-cy="previewContainer">
          <h2 className="title">Preview</h2>
          <MovieCard movie={foundMovie} />
        </div>
      )}
    </>
  );
};
