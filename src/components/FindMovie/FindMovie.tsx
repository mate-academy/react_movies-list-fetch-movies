import React, { useState } from 'react';
import classNames from 'classnames';
import { getMovie } from '../../api/api';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

type Props = {
  addMovie: (obj: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [currentMovie, setCurrentMovie] = useState<Movie | null>(null);
  const [isError, setIsError] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  const reset = () => {
    setInputValue('');
    setCurrentMovie(null);
    setIsError(false);
    setLoadingData(false);
  };

  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(event.target.value);
    setIsError(false);
  };

  const findMovieHandler = async () => {
    setLoadingData(true);
    const data = await getMovie(inputValue);

    if (!data) {
      setIsError(true);
    }

    setCurrentMovie(data);
    setInputValue('');
    setLoadingData(false);
  };

  const addMovieHandler = () => {
    if (!currentMovie) {
      return;
    }

    addMovie(currentMovie);
    reset();
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">

          <div className="control">
            <label
              className="label"
              htmlFor="movie-title"
            >
              Movie title

              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames(
                  'input',
                  {
                    'is-danger': isError,
                  },
                )}
                value={inputValue}
                onChange={inputHandler}
              />
            </label>
          </div>

          {isError && (
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
              onClick={findMovieHandler}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieHandler}
            >
              Add to the list
            </button>
          </div>
        </div>

        {loadingData && (
          <p className="help">
            Loading data
          </p>
        )}
      </form>

      {currentMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard movie={currentMovie} />
        </div>
      )}
    </>
  );
};
