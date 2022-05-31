import React, { FormEvent, useCallback, useState } from 'react';
import './FindMovie.scss';
import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

interface Props {
  addMovie: (item: Movie) => void;
}

enum Errors {
  none = '',
  required = 'Enter the title',
  notMatch = 'Can\'t find a movie with this title',
  empty = 'You need to find a movie',
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(Errors.none);

  const handleQuery = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setQuery(event.target.value);
      setError(Errors.none);
    }, [],
  );

  const findMovie = useCallback(() => {
    if (!query) {
      setError(Errors.required);
    } else {
      const find = async () => {
        const res = await request(query);

        if (res.Response === 'False') {
          setError(Errors.notMatch);
        } else {
          setMovie(res);
          setError(Errors.none);
        }
      };

      find();
    }
  }, [query]);

  const movieSubmit = useCallback((event: FormEvent) => {
    event.preventDefault();

    if (!movie) {
      setError(Errors.empty);
    }

    if (!error && movie) {
      addMovie(movie);
      setMovie(null);
      setQuery('');
    }
  }, [movie, error]);

  return (
    <>
      <form
        className="find-movie"
        onSubmit={movieSubmit}
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
              className="input is-danger"
              value={query}
              onChange={handleQuery}
            />
          </div>

          {error && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
