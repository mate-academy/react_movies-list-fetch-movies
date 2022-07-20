import React, { FormEvent, useCallback, useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import { Movie } from '../../react-app-env';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = React.memo(({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const onTitleChange = useCallback((
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setQuery(event.target.value);
    setError('');
  }, []);

  const handleMovieSearch = useCallback(async (event: FormEvent) => {
    event.preventDefault();

    const movieFromServer = await getMovie(query);

    if (!movieFromServer.Error) {
      setMovie(movieFromServer);
    } else {
      setError(movieFromServer.Error);
    }
  }, [query]);

  const handleMovieAdd = () => {
    if (movie) {
      addMovie(movie);
    }

    setQuery('');
    setMovie(null);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleMovieSearch}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              value={query}
              onChange={onTitleChange}
              className={classNames(
                'input',
                {
                  'is-danger': error,
                },
              )}
            />
          </div>

          {error && (
            <span>{error}</span>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
              disabled={!query}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleMovieAdd}
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
});
