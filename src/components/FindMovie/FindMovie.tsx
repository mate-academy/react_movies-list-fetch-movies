/* eslint-disable no-console */
/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';

import classnames from 'classnames';
import { MovieCard } from '../MovieCard';

interface Props {
  setMovies: (newMovie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState({} as Movie);
  const [error, setError] = useState(false);

  const fetchData = async () => {
    const url = `https://www.omdbapi.com/?apikey=aac058fa&t=${title}`;
    const uploadedMovie = await (await fetch(url)).json();

    if (uploadedMovie.Response === 'True') {
      setError(false);
      setMovie(uploadedMovie);
    } else if (uploadedMovie.Response === 'False') {
      setError(true);
    }
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setMovies(movie);
    setTitle('');
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(event.target.value);
  };

  return (
    <>
      <form className="find-movie" onSubmit={onSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classnames('input', { 'is-danger': error })}
              value={title}
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
              onClick={fetchData}
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
        <MovieCard movie={movie} />
      </div>
    </>
  );
};
