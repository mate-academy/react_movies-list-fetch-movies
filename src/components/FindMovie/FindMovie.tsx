/* eslint-disable */
import React, { useState } from 'react';
import classNames from 'classnames';

import { getMovies } from '../../api/movies';
import {MoviesList} from "../MoviesList";

type Props = {
  addMovie: (movie: Movie) => void,
  deleteMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie, deleteMovie }) => {
  const [error, setError] = useState(false);
  const [movies, setMovies] = useState([]);
  const [title, setTitle] = useState('');

  const searchMovie = () => {
    getMovies(title)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setMovies([]);
          setError(true);
          console.log('error');
        } else if (newMovie) {
          setMovies(newMovie);
          setError(false);
        }
      });

    console.log(movies);
  };

  console.log(movies);

  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setTitle(value);
  };

  const submitForm: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movies) {
      addMovie(movies[0]);
      setTitle('');
      setMovies([]);
      setError(false);
    }
  };

  return (
    <>
      <form onSubmit={submitForm}>
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
        <MoviesList movies={movies} deleteMovie={deleteMovie} />
      </div>
    </>

  );
};
