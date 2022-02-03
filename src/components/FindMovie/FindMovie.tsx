import React, { useState } from 'react';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api/movies';

import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);
  const [title, setTitle] = useState('');

  const searchMovie = () => {
    getMovie(title)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setMovie(null);
          setError(true);
        } else {
          setMovie(newMovie);
          setError(false);
        }
      });
  };

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setTitle(value);
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
      setError(false);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitForm}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                value={title}
                onChange={handleInput}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'input is-danger': error })}
              />
            </div>
          </label>

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
              onClick={searchMovie}
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
        {movie && <MovieCard movie={movie} />}
      </div>
    </>

  );
};
