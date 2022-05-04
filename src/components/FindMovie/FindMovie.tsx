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

          <label className="label" htmlFor="movie-year">
            Movie year

            <div className="control">
              <input
                defaultValue={0}
                type="text"
                id="movie-year"
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
        <h2 className="title mt-3">Preview</h2>
        <nav className="pagination" role="navigation" aria-label="pagination">
          <a className="pagination-previous is-disabled" title="This is the first page">Previous</a>
          <a className="pagination-next">Next page</a>
          <ul className="pagination-list">
            <li>
              <a className="pagination-link is-current" aria-label="Page 1" aria-current="page">1</a>
            </li>
            <li>
              <a className="pagination-link" aria-label="Goto page 2">2</a>
            </li>
            <li>
              <a className="pagination-link" aria-label="Goto page 3">3</a>
            </li>
          </ul>
        </nav>
        <MoviesList movies={movies} deleteMovie={deleteMovie} />
      </div>
    </>

  );
};
