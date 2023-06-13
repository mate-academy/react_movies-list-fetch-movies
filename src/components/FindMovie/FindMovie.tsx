import React, { useState } from 'react';
import classNames from 'classnames';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import { MovieData } from '../../types/MovieData';
import './FindMovie.scss';

interface Props {
  addMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [inputError, setInputError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [movie, setMovie] = useState<Movie | null>();

  const hendlerSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    await getMovie(query)
      .then(response => {
        if ('Title' in response) {
          const {
            Title, Plot, Poster, imdbID,
          } = response as MovieData;

          if (imdbID) {
            const normalizedMovie: Movie = {
              title: Title,
              description: Plot,
              imgUrl: Poster !== 'N/A' ? Poster : '',
              imdbUrl: `https://www.imdb.com/title/${imdbID}`,
              imdbId: imdbID,
            };

            setMovie(normalizedMovie);
          } else {
            setInputError(true);
          }
        } else {
          setInputError(true);
        }
      })
      .catch(() => setInputError(true))
      .finally(() => setIsLoading(false));
  };

  const hendlerQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setInputError(false);
  };

  const handleClearMovie = () => {
    setQuery('');
    setMovie(null);
  };

  const handleAdd = () => {
    if (movie) {
      addMovie(movie);
    }

    handleClearMovie();
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={hendlerSubmit}
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
              placeholder="Enter a title to query"
              className={classNames('input', { 'is-dander': inputError })}
              value={query}
              onChange={hendlerQuery}

            />
          </div>
          {inputError && (
            <p className="help is-danger" data-cy="errorMessage">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="queryButton"
              type="submit"
              className={classNames(
                'button',
                'is-light',
                { 'is-loading': isLoading },
              )}
              disabled={!query || isLoading}
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
                onClick={handleAdd}
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
