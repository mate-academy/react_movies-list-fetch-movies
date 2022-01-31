/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { ChangeEventHandler, MouseEventHandler, useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

// Components
import { MovieCard } from '../MovieCard';

// Types
import { AddMovie } from '../../types/AddMovie';

interface Props {
  onAdd: AddMovie;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movieTitle, setMovieTittle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const changeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = e.currentTarget.value.trimLeft();

    setMovieTittle(value);
    setErrorMessage('');
  };

  const findMovie: MouseEventHandler<HTMLButtonElement> = () => {
    fetch(`https://www.omdbapi.com/?apikey=e6ee143&t=${movieTitle}`)
      .then(respond => respond.json())
      .then(findedMovie => {
        if (!findedMovie.Error) {
          setMovie(findedMovie);
          setErrorMessage('');

          return;
        }

        setErrorMessage(findedMovie.Error);
        setMovie(null);
      });
  };

  const addMovie: MouseEventHandler<HTMLButtonElement> = () => {
    onAdd(movie);
    setMovie(null);
    setMovieTittle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label
            className="label"
            htmlFor="movie-title"
          >
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={movieTitle}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMessage })}
              onChange={changeHandler}
            />
          </div>

          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={findMovie}
              disabled={!movieTitle}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              disabled={!movie}
              onClick={addMovie}
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
