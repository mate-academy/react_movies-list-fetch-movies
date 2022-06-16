import React, { useState } from 'react';
import classNames from 'classnames';

import './FindMovie.scss';

import { getMovie } from '../../api';

import { MovieCard } from '../MovieCard';

interface Props {
  onAddMovie: (movie: Movie) => void,
}

export const FindMovie: React.FC<Props> = ({ onAddMovie }) => {
  const [movie, stateMovie] = useState<Movie | null>(null);
  const [title, setTitile] = useState('');
  const [isMovieFound, setIsMovieFound] = useState(false);

  const clearFields = () => {
    setTitile('');
    stateMovie(null);
  };

  const findMovieHandler = () => {
    getMovie(title)
      .then(response => stateMovie(response))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.log(error);
        setIsMovieFound(true);
        clearFields();
      });
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
              value={title}
              onChange={(event) => {
                setTitile(event.target.value);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': isMovieFound })}
            />
          </div>

          {isMovieFound
          && (

            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              data-cy="find"
              type="button"
              className="button is-light"
              onClick={findMovieHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              data-cy="add"
              type="button"
              className="button is-primary"
              onClick={() => {
                if (movie !== null) {
                  onAddMovie(movie);
                  clearFields();
                  setIsMovieFound(false);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={movie} />
        </div>
      )}

    </>
  );
};
