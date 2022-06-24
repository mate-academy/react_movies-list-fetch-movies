import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (movie: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [errorMessage, setErrorMessage] = useState(false);

  const inputHandler = (event:ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
    setErrorMessage(false);
  };

  const loadFilms = () => {
    getMovie(title)
      .then(response => {
        if (response.Title) {
          setMovie(response);
        } else {
          setErrorMessage(true);
          setMovie(null);
          setTitle('');
        }
      });
  };

  const handleSubmit = (event:ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (movie && !errorMessage) {
      addMovie(movie);
      setMovie(null);
      setTitle('');
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
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMessage })}
              value={title}
              onChange={inputHandler}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              data-cy="find"
              className="button is-light"
              disabled={!title}
              onClick={loadFilms}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              data-cy="add"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && !errorMessage && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}
    </>
  );
};
