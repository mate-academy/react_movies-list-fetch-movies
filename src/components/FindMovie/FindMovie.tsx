import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api/movies';

import { MovieCard } from '../MovieCard';

type Props = {
  toAddMovie: (movie: Movie) => void,
  sameMovie: boolean;
  setSameMovie: (value: boolean) => void;
};

export const FindMovie: React.FC<Props> = ({ toAddMovie, sameMovie, setSameMovie }) => {
  const [inputValue, setInputValue] = useState('');
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const [findError, setFindError] = useState(false);

  const changeQueryHandler = (value: string) => {
    setShowError(false);
    setSameMovie(false);
    setFindMovie(null);
    setInputValue(value);
  };

  const downloadMovie = async () => {
    setShowError(false);
    setShowLoader(true);
    setFindMovie(null);

    try {
      const response = await getMovie(inputValue);

      if ('Error' in response) {
        // Error when response is not a Movie
        // eslint-disable-next-line no-console
        console.log(response.Error);

        setFindError(true);
      } else {
        setFindMovie(response);
      }
    } catch (error) {
      // Error of fetch
      // eslint-disable-next-line no-console
      console.log('catch error', error);

      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  const addToListHandler = () => {
    if (findMovie !== null) {
      toAddMovie(findMovie);
      setFindMovie(null);
      setInputValue('');
    }
  };

  const submitForm = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (inputValue.length === 0) {
      setShowError(true);
    } else {
      downloadMovie();
    }
  };

  return (
    <>
      {showLoader && (<p>Loading...</p>)}
      <form
        className="find-movie"
        onSubmit={submitForm}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                name="title"
                value={inputValue}
                onChange={event => changeQueryHandler(event.target.value)}
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input',
                  { 'is-danger': showError })}
              />
            </div>
          </label>
          {showError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addToListHandler()}
              disabled={!findMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {(findMovie !== null) && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={findMovie} />
          </>
        )}
        {sameMovie && <>there is the same movie</>}
        {findError && <>can&#x27;t find this movie</>}
      </div>
    </>
  );
};
