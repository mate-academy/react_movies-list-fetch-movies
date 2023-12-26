import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api';
import { Movie } from '../../libs/types';
import { ErrorMessages } from '../../libs/enums';
import { getNormalizedMovie } from '../../libs/helpers';
import { MovieCard } from '../MovieCard';

type Props = {
  onSelectMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ onSelectMovie }) => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setErrorMessage('');
  };

  const handleLoadMovie = () => {
    setLoading(true);
    setMovie(null);

    getMovie(query)
      .then((response) => {
        if ('Error' in response) {
          throw new Error(ErrorMessages.notFindMovie);
        }

        const normalizedMovie = getNormalizedMovie(response);

        setMovie(normalizedMovie);
      })
      .catch((error: Error) => {
        setErrorMessage(error.message);
      })
      .finally(() => setLoading(false));
  };

  const handleSelectMovie = () => {
    if (movie) {
      onSelectMovie(movie);
    }

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
                'is-danger': !!errorMessage,
              })}
              value={query}
              onChange={handleChangeQuery}
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
              data-cy="searchButton"
              type="submit"
              className={classNames('button is-light', {
                'is-loading': loading,
              })}
              disabled={!query || loading}
              onClick={handleLoadMovie}
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
                onClick={handleSelectMovie}
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
