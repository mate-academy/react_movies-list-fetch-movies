import React, { useState } from 'react';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

interface Props {
  addNewMovie: (movie: Movie) => void;
}

export const FindMovie: React.FC<Props> = ({ addNewMovie }) => {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState(false);

  const reset = () => {
    setMovie(null);
    setQuery('');
    setError(false);
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setError(false);
    setQuery(event.target.value);
  };

  const handleSubmit = (
    event:
    React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => {
    event.preventDefault();

    if (!movie) {
      setError(true);
    }

    if (movie) {
      addNewMovie(movie);
    }

    reset();
  };

  const findMovie = () => {
    getMovie(query).then(newMovie => {
      if (!newMovie.Title) {
        setError(true);
      }

      if (newMovie.Title) {
        setMovie(newMovie);
      }
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              onChange={handleChange}
              value={query}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
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
              onClick={findMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              onClick={handleSubmit}
              type="button"
              className="button is-primary"
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
};
