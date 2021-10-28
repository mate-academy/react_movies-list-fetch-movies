import React, { useState } from 'react';
import classNames from 'classnames';
import { getData } from '../../api/api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

type Props = {
  addMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const findMovie = () => {
    getData(title)
      .then(movieFromServer => {
        if (movieFromServer.Response === 'False') {
          setTitle('');
          setMovie(null);
          setError(true);
        } else {
          setMovie(movieFromServer);
          setTitle('');
          setError(false);
        }
      });
  };

  const sendMovie: React.FormEventHandler = (e) => {
    e.preventDefault();

    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={sendMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', {
                  'is-danger': error,
                })}
                value={title}
                onChange={(e) => {
                  setError(false);
                  setTitle(e.target.value);
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
