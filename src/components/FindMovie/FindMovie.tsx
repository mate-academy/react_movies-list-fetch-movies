import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isErrorMessage, setIsErrorMesage] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query) {
      setIsLoading(true);

      getMovie(query)
        .then((res) => {
          if ('Error' in res) {
            throw new Error();
          }

          setMovie({
            title: res.Title,
            description: res.Plot,
            imgUrl: res.Poster !== 'N/A'
              ? res.Poster
              : 'https://via.placeholder.com/360x270.png?text=no%20preview',
            imdbUrl: `https://www.imdb.com/title/${res.imdbID}`,
            imdbId: res.imdbID,
          });
        })
        .catch(() => setIsErrorMesage(true))
        .finally(() => setIsLoading(false));
    }

    setQuery('');
  };

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsErrorMesage(false);
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
    }

    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className="input is-danger"
              value={query}
              onChange={handleChangeQuery}
            />
          </div>

          {isErrorMessage && (
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
              className={classNames('button', {
                'is-light': !isLoading,
                'is-loading': isLoading,
              })}
              disabled={query === ''}
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
