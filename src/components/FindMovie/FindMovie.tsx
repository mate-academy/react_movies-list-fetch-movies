import {
  ChangeEvent, FC, FormEvent, useState,
} from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  onAdd: (movie: Movie) => void
}

export const FindMovie: FC<Props> = ({ onAdd }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const findMovie = () => {
    getMovie(query)
      .then(data => {
        if (data.Response === 'True') {
          setMovie(data);
        } else {
          setError(true);
        }
      });
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setError(false);
  };

  const resetForm = () => {
    setQuery('');
    setMovie(null);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (movie !== null) {
      onAdd(movie);
      resetForm();
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error })}
              value={query}
              onChange={handleChange}
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
              disabled={movie === null}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && !error && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
