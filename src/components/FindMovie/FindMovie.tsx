import React, { FC, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

interface Props {
  findMovie(query: string): void;
  foundMovie: Movie | null;
  addMovie: () => void;
  error: string;
  isLoading: boolean;
}

export const FindMovie: FC<Props> = ({
  findMovie,
  foundMovie,
  error,
  addMovie,
  isLoading,
}) => {
  const [query, setQuery] = useState('');

  const inputClass = classNames('input', { 'is-danger': error });

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setQuery(value.toLowerCase());
  };

  const handleClick = (value: string) => {
    if (!value.trim()) {
      return;
    }

    findMovie(value);

    if (!foundMovie?.title) {
      setQuery('');
    }
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleClick(query);
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
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className={inputClass}
              onChange={handleChange}
            />
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              onClick={() => handleClick(query)}
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              onClick={addMovie}
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        { foundMovie
          ? <MovieCard {...foundMovie} />
          : isLoading
            && (
              <div className="container-loader">
                <div className="loader" />
              </div>
            )}
      </div>
    </>
  );
};
