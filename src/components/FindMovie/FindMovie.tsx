import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

interface Props {
  movieAdd: (movie: Movie) => void;
}
export const FindMovie: React.FC<Props> = ({ movieAdd }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const findMovie = () => {
    getMovie(title)
      .then(newMovie => {
        if (newMovie.Response === 'False') {
          setError(true);
          setMovie(null);
          setTitle('');
        } else {
          setMovie(newMovie);
          setError(false);
          setTitle('');
        }
      });
  };

  const formSumbit: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movie) {
      movieAdd(movie);
      setMovie(null);
      setTitle('');
    }
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={formSumbit}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title

            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'is-danger': error })}
                value={title}
                onChange={event => {
                  setTitle(event.currentTarget.value);
                  setError(false);
                }}
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie
       && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
