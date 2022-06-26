import React, { FormEvent, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovies } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  onAddMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({
  onAddMovie,
}) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState<string>('');
  const [title, setTitle] = useState('');

  const handleBadResponse = (): void => {
    setMovie(null);
    // eslint-disable-next-line max-len
    setError('Something bad hapenned with our backend. We\'re checking it. Please stay on the line');
  };

  const addMovie = () => {
    if (movie) {
      onAddMovie(movie);
    }

    setTitle('');
    setMovie(null);
  };

  const findMovie = (event: FormEvent) => {
    event.preventDefault();
    getMovies(title, handleBadResponse)
      .then((response: Movie) => {
        if (response.Error) {
          setMovie(null);
          setError(response.Error);
        } else {
          setMovie(response);
          setError('');
        }
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={findMovie}
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
              className={classNames(
                'input',
                { 'is-danger': error },
              )}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
              }}
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
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard movie={movie} />}
        {error && <p>{error}</p>}
      </div>
    </>
  );
};
