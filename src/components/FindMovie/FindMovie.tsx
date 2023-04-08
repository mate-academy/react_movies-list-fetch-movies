import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { showErrorMessage, createMovie } from '../../helpers/helpers';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setQuery(event.target.value);
  };

  const handleAddMovieClick = () => {
    if (movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  };

  const loadMovie = async (event: React.FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      const serverResponse = await getMovie(query);

      if ('Error' in serverResponse) {
        setErrorMessage(serverResponse.Error);

        return;
      }

      const foundMovie = createMovie(serverResponse);

      setMovie(foundMovie);
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={loadMovie}
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
              className="input is-dander"
              value={query}
              onChange={handleInput}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger" data-cy="errorMessage">
              {showErrorMessage(errorMessage)}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="searchButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query.trim()}
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
                onClick={handleAddMovieClick}
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
