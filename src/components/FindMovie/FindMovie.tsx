import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import { getMovie } from '../../api/movies';

import { MovieCard } from '../MovieCard';

type Props = {
  toAddMovie: (movie: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ toAddMovie }) => {
  const [query, toQueryState] = useState('');
  const [findMovie, setFindMovie] = useState<Movie | null>(null);
  const [showLoader, setShowLoader] = useState(false);
  const [showError, setShowError] = useState(false);
  const [addToList, setAddToList] = useState(false);

  // control query......................................................
  const changeQueryHandler = (inputValue: string) => {
    setShowError(false);
    setFindMovie(null);
    toQueryState(inputValue);
  };

  // async download movie...............................................
  const downloadMovie = async () => {
    setShowError(false);
    setShowLoader(true);
    setFindMovie(null);

    try {
      const newMovie = await getMovie(query);

      // eslint-disable-next-line no-console
      console.log('undefined if didnt find', newMovie.imdbID);

      setFindMovie(newMovie);

      // if (newMovie.imdbID) {
      //   setFindMovie(newMovie);
      // } else {
      //   setShowError(true);
      // }
      // work but its not a catch mistake
    } catch (error) {
      // eslint-disable-next-line no-console
      console.log('catch error', error);

      setShowError(true);
    } finally {
      setShowLoader(false);
    }
  };

  const addToListHandler = (value: boolean) => {
    setAddToList(value);

    // eslint-disable-next-line no-console
    console.log(addToList);

    if (findMovie) {
      toAddMovie(findMovie);
      setFindMovie(null);

      setAddToList(false);
    }
  };

  const submitForm = (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (query.length === 0) {
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
                value={query}
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
              onClick={() => addToListHandler(true)}
              disabled={!findMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {findMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard movie={findMovie} />
          </>
        )}
      </div>
    </>
  );
};
