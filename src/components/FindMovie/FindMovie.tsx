import React, { ChangeEvent, useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import { getMovie } from '../../api';
import { MovieCard } from '../MovieCard';

interface Props {
  addMovie: (movie: Movie) => void
}

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [error, setError] = useState(false);

  const findMovie = () => {
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

  const handleMovie: React.FormEventHandler = (event) => {
    event.preventDefault();

    if (movie) {
      addMovie(movie);
      setTitle('');
      setMovie(null);
    }
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => {
    const { value } = event.target;

    setError(false);
    setTitle(value);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          {/* eslint-disable-next-line jsx-a11y/label-has-associated-control */}
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={title}
              onChange={(event) => handleInput(event)}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', {
                'is-danger': error,
              })}
            />
          </div>
          {error
          && (
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
              onClick={handleMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        <h2 className="title">Preview</h2>
        { movie && <MovieCard movie={movie} />}
      </div>
    </>
  );
};
