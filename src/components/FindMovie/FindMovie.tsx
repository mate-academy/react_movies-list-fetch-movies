import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api/getMovie';
import { MovieCard } from '../MovieCard';

type Props = {
  onAdd:(movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  const handleRequest = () => {
    getMovie(title)
      .then(movieFromServer => {
        if (movieFromServer.Response === 'False') {
          setMovie(null);
          setError(true);
        }

        setMovie(movieFromServer);
      });
  };

  const handleFocus = () => {
    setError(false);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (movie?.Response === 'True') {
      onAdd(movie);
      setTitle('');
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <div className="control">
            <label className="label" htmlFor="movie-title">
              Movie title
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': error })}
                value={title}
                onChange={handleTitleChange}
                onFocus={handleFocus}
              />
            </label>
          </div>

          {error && (
            <p className="error">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleRequest}
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

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie?.Response === 'True' && (
          <MovieCard movie={movie} />
        )}
      </div>
    </>
  );
};
