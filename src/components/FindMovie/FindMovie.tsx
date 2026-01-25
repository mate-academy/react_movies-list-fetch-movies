import React, { useState } from 'react';
import './FindMovie.scss';
import { Movie } from '../../types/Movie';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';
import classNames from 'classnames';

type Props = {
  newMovie: (value: Movie) => void;
};

export const FindMovie: React.FC<Props> = ({ newMovie }) => {
  const [movie, setMovie] = useState<Movie>();
  const [error, setError] = useState(false);

  const [inputValue, setInputValue] = useState('');

  const [loading, setLoading] = useState(false);

  const findMovie = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoading(true);
    if (inputValue === '') {
      setError(true);

      return;
    }

    getMovie(inputValue)
      .then(data => {
        if (!data.Title) {
          return setError(true);
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: data.imdbID,
          imdbId: data.imdbID,
        });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const addMovie = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();

    if (!movie) {
      return false;
    }

    newMovie(movie);
    setMovie();
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = event.target.value;
    const normalizedValue = rawValue;

    if (normalizedValue === '') {
      setError(false);
    }

    setError(false);
    setInputValue(normalizedValue);
  };

  return (
    <>
      <form className="find-movie" onSubmit={findMovie}>
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
              className={classNames({
                input: true,
                'is-danger': error,
              })}
              value={inputValue}
              onChange={inputHandler}
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
              className={classNames({
                'button is-light': true,
                'is-loading': loading,
              })}
              disabled={inputValue === ''}
            >
              Find a movie
            </button>
          </div>

          {movie && (
            <div className="control">
              <button
                data-cy="addButton"
                type="button"
                className="button is-primary"
                onClick={addMovie}
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
