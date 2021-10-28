import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { request } from '../api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState(false);

  const handleInput = (event: React.FormEvent<HTMLInputElement>) => {
    setMovie(null);
    setError(false);
    setTitle(event.currentTarget.value);
  };

  const find = () => {
    setLoading(true);
    request(title)
      .then(result => {
        if (result.Response === 'False') {
          setError(true);
          setLoading(false);
        } else {
          setMovie(result);
          setLoading(false);
          setTitle('');
        }
      });
  };

  const handleAddMovie = () => {
    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
      setError(false);
    }
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                value={title}
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': error })}
                onChange={handleInput}
              />
            </div>
          </label>
          {error
          && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames('button', { 'is-light': loading })}
              onClick={find}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={handleAddMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        { loading ? 'Loading...'
          : (movie
            && (
              <>
                <h2 className="title">Preview</h2>
                <MovieCard movie={movie} />
              </>
            )
          )}
      </div>
    </>
  );
};
