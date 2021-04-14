import React, { useState, useCallback } from 'react';
import './FindMovie.scss';

import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api/api';
import { Loader } from '../Loader/Loader';

export const FindMovie = (
  {
    addMovieHandler,
    isDuplicate,
    setIsDuplicate,
    isAdd,
    setIsAdd,
  },
) => {
  const [title, setTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [isFound, setIsFound] = useState(false);
  const [isLoad, setIsLoad] = useState(false);

  const findMovieHandler = useCallback(() => {
    setIsLoad(true);
    getMovies(title).then((response) => {
      if (response.Error) {
        setIsFound(true);
        setFoundMovie('');

        return;
      }

      setFoundMovie(response);
      setIsFound(false);
      setIsLoad(false);
    });
  }, [title]);

  const onChangeInputHandler = useCallback((e) => {
    setTitle(e.target.value);
    setIsFound(false);
    setFoundMovie('');
    setIsDuplicate(false);
    setIsAdd(false);
  }, [setIsDuplicate, setIsAdd]);

  // if (foundMovie) {
  //   setAddActive(false);
  // }

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
              className="input is-danger"
              value={title}
              onChange={onChangeInputHandler}
            />
          </div>
          <div>
            {isFound && (
            <p className="help  is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )}
            {isDuplicate && (
            <p className="help  is-danger">
              This movie already exists in collection
            </p>
            )}
            {isAdd && (
              <p className="success-add">
                <strong>{foundMovie.Title}</strong>
                {' '}
                movie was added!
              </p>
            )}
          </div>
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
              onClick={() => addMovieHandler(foundMovie)}
              disabled={!foundMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <Loader isLoad={isLoad}>
          {!isFound && foundMovie
        && (
          <MovieCard
            title={foundMovie.Title}
            description={foundMovie.Plot}
            imgUrl={foundMovie.Poster}
            imdbUrl={foundMovie.Website}
          />
        )}
        </Loader>

      </div>
    </>
  );
};

FindMovie.defaultProps = {
  isDuplicate: 'null',
  isAdd: false,
};

FindMovie.propTypes = {
  addMovieHandler: PropTypes.func.isRequired,
  setIsDuplicate: PropTypes.func.isRequired,
  setIsAdd: PropTypes.func.isRequired,
  isDuplicate: PropTypes.bool,
  isAdd: PropTypes.bool,
};
