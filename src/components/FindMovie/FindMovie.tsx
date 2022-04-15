import React, { useState } from 'react';
import { getData } from '../../api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  onAdd: (movie: Movie) => void;
  onClear: () => void;
}

export const FindMovie: React.FC<Props> = ({ onAdd, onClear }) => {
  const [title, setTitle] = useState('');
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState<Movie | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setHasError(false);
    setTitle(event.target.value);
  };

  const resetInput = () => {
    setTitle('');
    setQuery(null);
  };

  const handleSubmit = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query) {
      onAdd(query);
      resetInput();
    } else {
      setHasError(true);
    }
  };

  const getMovie = () => {
    getData(title)
      .then(movie => {
        if (movie.Title) {
          setQuery(movie);
        } else {
          setHasError(true);
          setQuery(null);
        }
      });
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
              value={title}
              onChange={handleChange}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
            />
          </div>
          {hasError && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              className="button is-primary"
              type="submit"
            >
              Add to the list
            </button>
          </div>
        </div>
        <button
          type="button"
          className="button is-light"
          onClick={onClear}
        >
          Clear List
        </button>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {query && (
          <MovieCard movie={query} />
        )}
      </div>
    </>
  );
};
