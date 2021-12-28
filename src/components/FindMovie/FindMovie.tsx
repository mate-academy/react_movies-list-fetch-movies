import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

type Props = {
  addMovie: (arg0: Movie) => void,
};

export const FindMovie: React.FC<Props> = ({ addMovie }) => {
  const [searchField, setSearchField] = useState('');
  const [findMovie, setFindMovie] = useState(null);
  const [searchError, setSearchError] = useState(false);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
            <div className="control">
              <input
                type="text"
                id="movie-title"
                placeholder="Enter a title to search"
                className={classNames('input', { 'is-danger': searchError })}
                value={searchField}
                onChange={(event) => {
                  setSearchField(event.target.value);
                  setSearchError(false);
                }}
              />
            </div>
          </label>

          {searchError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              disabled={searchField.length === 0}
              className="button is-light"
              onClick={() => {
                getMovie(searchField)
                  .then(result => {
                    if (result.Response === 'True') {
                      setFindMovie(result);
                    } else {
                      setSearchError(true);
                    }
                  });
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              disabled={searchError}
              className="button is-primary"
              onClick={() => {
                if (findMovie) {
                  addMovie(findMovie);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!searchError && <MovieCard movie={findMovie} />}
      </div>
    </>
  );
};
