import React, { useState, MouseEvent, ChangeEvent } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import { parseData } from '../../util';
import { MovieData } from '../../types/MovieData';

type Props = {
  onMovieAdd: (movie: Movie | null) => void;
};

export const FindMovie: React.FC<Props> = ({ onMovieAdd }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');

  const handleQueryChange = (event: ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setQuery(event.target.value);
  };

  const handleSubmit = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setIsLoading(true);
    getMovie(query.toLowerCase().trim())
      .then(response => {
        if ('Error' in response) {
          setHasError(true);
        } else {
          setMovie(parseData(response as MovieData));
        }
      })
      .catch(error => {
        setHasError(true);
        throw new Error(error.errorMessage);
      })
      .finally(() => setIsLoading(false));
  };

  const handleMovieAdd = () => {
    onMovieAdd(movie);
    setMovie(null);
    setQuery('');
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
              className={classNames('input', {
                'is-danger': hasError,
              })}
              value={query}
              onChange={handleQueryChange}
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
              className={classNames('button is-light', {
                'is-loading': isLoading,
              })}
              onClick={handleSubmit}
              disabled={!query}
            >
              {movie ? (
                'Search again'
              ) : (
                'Find a movie'
              )}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={handleMovieAdd}
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
