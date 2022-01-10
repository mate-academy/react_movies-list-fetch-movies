import React, { useState } from 'react';
import './FindMovie.scss';
import classnames from 'classnames';
import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: any,
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [errorFind, setErrorFind] = useState(false);

  const findMovie = () => {
    getMovie(title)
      .then(movieFromServer => {
        if (movieFromServer.Title) {
          setMovie(movieFromServer);
        } else {
          setErrorFind(true);
        }

        setTitle('');
      });
  };

  const handleChange = (event: any) => {
    setTitle(event.target.value);
    setErrorFind(false);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classnames('input', { 'is-danger': errorFind })}
                value={title}
                onChange={handleChange}
              />
            </div>
          </label>
          {errorFind && (
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
              type="button"
              className="button is-primary"
              onClick={() => addMovie(movie)}
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
