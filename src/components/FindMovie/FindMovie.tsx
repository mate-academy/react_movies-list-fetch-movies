/* eslint-disable jsx-a11y/label-has-associated-control */
import React, { useState } from 'react';
import './FindMovie.scss';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  setMovies: React.Dispatch<React.SetStateAction<Movie[]>>;
};

export const FindMovie: React.FC<Props> = ({ setMovies }) => {
  const [searchValue, setSearchValue] = useState('');
  const [ErrorMessage, setErrorMessage] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);

  const setInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
    setErrorMessage('');
  };

  const submitForm = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    if (movie) {
      setMovies(prevMovies => {
        const isMovieExists = prevMovies.some(prevMovie => prevMovie.imdbID === movie.imdbID);

        if (isMovieExists) {
          setErrorMessage('Movie already added');

          return prevMovies;
        }

        setSearchValue('');
        setMovie(null);

        return [...prevMovies, movie];
      });
    }
  };

  const findMovie = async () => {
    if (!searchValue) {
      setMovie(null);
      setErrorMessage('Title is required!');

      return;
    }

    try {
      const response = await getMovie(searchValue);

      if (response.Response === 'True') {
        setMovie(response);
        setErrorMessage('');
      } else {
        setMovie(null);
        setErrorMessage('Can\'t find a movie with such a title');
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn(error);
    }
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
              className={classNames('input', { 'is-danger': ErrorMessage })}
              value={searchValue}
              onChange={setInputValue}
            />
          </div>

          <p className="help is-danger">
            {ErrorMessage}
          </p>
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
              disabled={!movie}
              onClick={submitForm}
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
