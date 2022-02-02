import React, { useState, ChangeEventHandler } from 'react';
import cn from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

import { AddMovie } from '../../types/AddMovie';

interface Props {
  onAdd: AddMovie;
}

export const FindMovie: React.FC<Props> = ({ onAdd }) => {
  const [movieTitle, setMovieTitle] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const titleChangeHandler: ChangeEventHandler<HTMLInputElement> = (e) => {
    const title = e.target.value;

    setErrorMessage('');
    setMovieTitle(title.trim());
  };

  const findMovie = () => {
    fetch(`https://www.omdbapi.com/?apikey=e6ee143&t=${movieTitle}`)
      .then(res => res.json())
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

  const addMovie = () => {
    onAdd(movie);
    setMovie(null);
    setMovieTitle('');
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <p className="label">
            Movie title
          </p>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={movieTitle}
              placeholder="Enter a title to search"
              className={cn('input', { 'is-danger': errorMessage })}
              onChange={titleChangeHandler}
            />
          </div>

          {errorMessage && (
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
              disabled={!movieTitle}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
              disabled={!movie}
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
