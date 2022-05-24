import classNames from 'classnames';
import React, { ChangeEvent, useState } from 'react';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  repeat: boolean;
  addMovies: (m: Movie) => void;
  handleRepeat: () => void;
};

export const FindMovie: React.FC<Props> = ({
  addMovies,
  repeat,
  handleRepeat,
}) => {
  const [movie, setMovie] = useState(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState('');

  const loadMovie = async () => {
    const movieFromServer = await getMovie(query);

    if ('Error' in movieFromServer) {
      setError(movieFromServer.Error);
    } else {
      setMovie(movieFromServer);
    }
  };

  const changeQuery = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value);
    setError('');
    handleRepeat();
  };

  const submitForm = (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (movie) {
      addMovies(movie);
      setQuery('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': error.length > 0 })}
              value={query}
              onChange={changeQuery}
            />
          </div>

          {error.length > 0 && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {repeat && (
            <p className="help is-danger">
              This movie is already exist in the list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className={classNames('button', { 'is-primary': query.trim() })}
              onClick={loadMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className={classNames('button', { 'is-primary': movie })}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={movie} />
          </>
        )}
      </div>
    </>
  );
};
