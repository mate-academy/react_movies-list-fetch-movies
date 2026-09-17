import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import classNames from 'classnames';
import { getMovie } from '../../api';

type Props = {
  onAdd: (movie: Movie) => void;
};
export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movie, setMovie] = useState<Movie>();
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const DEFAULT_PICTURE =
    'https://via.placeholder.com/360x270.png?text=no%20preview';

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const responseData = getMovie(query);

    responseData.finally(() => setIsLoading(false));

    responseData.then(data => {
      if ('Error' in data) {
        setError(true);

        return;
      }

      const responseMovie: Movie = {
        title: data.Title,
        description: data.Plot,
        imgUrl: data.Poster === 'N/A' ? DEFAULT_PICTURE : data.Poster,
        imdbId: data.imdbID,
        imdbUrl: `https://www.imdb.com/title/${data.imdbID}`,
      };

      setMovie(responseMovie);
    });
  }

  function handleInput(event: React.ChangeEvent<HTMLInputElement>) {
    setError(false);
    setMovie(undefined);
    setQuery(event.target.value);
  }

  function handleAdd() {
    if (movie) {
      onAdd(movie);
      setQuery('');
      setMovie(undefined);
    }
  }

  return (
    <>
      <form className="find-movie" onSubmit={event => handleSubmit(event)}>
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
              className={classNames('input', error ? 'is-danger' : '')}
              value={query}
              onChange={event => handleInput(event)}
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
              className={classNames(
                'button',
                'is-light',
                isLoading ? 'is-loading' : '',
              )}
              disabled={query.length === 0}
            >
              {!movie ? 'Find a movie' : 'Search again'}
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={() => handleAdd()}
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
