/* eslint-disable no-console */
import React, { useState } from 'react';
import classname from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

interface Props {
  addMovies: (value: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addMovies }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [erors, setErors] = useState(true);

  const findMovie = () => {
    getMovie(title)
      .then(response => setMovie(response))
      .catch(() => setErors(false));
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classname('input',
                { 'is-danger': !erors, 'is-primary': erors })}
              value={title}
              onChange={
                (event) => {
                  (
                    setTitle(event.target.value)
                  );
                  setErors(true);
                }
              }
            />
          </div>

          <p className="help is-danger">
            {!erors ? 'Can`t find a movie with such a title' : ''}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
              data-cy="find"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              data-cy="add"
              onClick={() => {
                if (movie) {
                  addMovies(movie);
                  setMovie(null);
                  setTitle('');
                  setErors(true);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        { movie
          ? (
            <>
              <h2 className="title">Preview</h2>
              <MovieCard movie={movie} />
            </>
          )
          : <></> }
      </div>
    </>
  );
};
