import React, { useCallback, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getFilm } from '../../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: CallableFunction,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string>('');

  const findMovie = useCallback(async (title: string) => {
    const data = await getFilm(title);

    if (data.Error) {
      setError('Can\'t find a movie with such a title');
      setFoundMovie(null);
    } else {
      setFoundMovie(data);
      setError('');
    }
  }, [query]);

  const handleSubmit = (event: React.SyntheticEvent) => {
    event.preventDefault();
    if (!error) {
      addMovie(foundMovie);
      setQuery('');
      setFoundMovie(null);
    }
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
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'input is-danger': error,
              })}
              onChange={(event) => {
                setQuery(event.target.value);
                setError('');
              }}
            />
          </div>
          {error
            && (
              <p className="help is-danger">
                {error}
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="find"
              type="button"
              className="button is-light"
              onClick={() => findMovie(query)}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="add"
              type="submit"
              className="button is-primary"
              disabled={error.length > 0 || query.length === 0}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundMovie !== null
        && (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard movie={foundMovie} />
          </div>
        )}
    </>
  );
};
