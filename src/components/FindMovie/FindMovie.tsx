/* eslint-disable no-console */
import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

type Props = {
  setMovieToList: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ setMovieToList }) => {
  const [inputValue, setInputValue] = useState('');
  const [movie, setMovie] = useState<Movie | null>(null);
  const [checkFindMovie, setCheck] = useState(false);

  const setTitleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setCheck(false);
  };

  const findMovie = async () => {
    try {
      const findMovieFromServer = await getMovie(inputValue);

      if (findMovieFromServer.Response === 'True') {
        setMovie(findMovieFromServer);
      } else {
        setMovie(null);
        setCheck(true);
      }
    } catch {
      throw new Error('Error');
    }
  };

  const addMovieToList = (foundMovie: Movie) => {
    if (foundMovie) {
      setMovieToList(foundMovie);
      setMovie(null);
    }

    setInputValue('');
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
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': checkFindMovie })}
              value={inputValue}
              onChange={setTitleInput}
            />
          </label>

          {checkFindMovie && (
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
              onClick={() => movie && addMovieToList(movie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {
          movie && <MovieCard movie={movie} />
        }
      </div>
    </>
  );
};
