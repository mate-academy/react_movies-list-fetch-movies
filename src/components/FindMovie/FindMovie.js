import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const debounce = (func, delay) => {
  let timer;

  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(func, delay, ...args);
  };
};

export const FindMovie = ({ findMovie, addMovie, movies }) => {
  const [searchValue, setSearchValue] = useState('');
  const [newMovie, setNewMovie] = useState({});
  const [appliedQuery, setAppliedQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState(undefined);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, 700),
    [],
  );

  const findSearchMovie = async() => {
    const searchMovie = await findMovie(appliedQuery);

    if (!searchMovie.imdbId) {
      setErrorMessage('Can\'t find a movie with such a title');

      return;
    }

    setErrorMessage('');
    setNewMovie(searchMovie);
  };

  const addWithoutDuplicates = (event) => {
    event.preventDefault();
    const duplicate = movies.some(movie => movie.imdbId === newMovie.imdbId);

    if (duplicate) {
      setErrorMessage('Can\'t add duplicated movie');

      return;
    }

    setErrorMessage('');

    addMovie(newMovie);
    setSearchValue('');
    setAppliedQuery('');
    setNewMovie({});
  };

  return (
    <>
      <form
        onSubmit={addWithoutDuplicates}
        className="find-movie"
        autoComplete="off"
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': errorMessage })}
              value={searchValue}
              onChange={(event) => {
                setSearchValue(event.target.value);
                applyQuery(event.target.value);
              }}
            />
          </div>

          { errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={findSearchMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
            <button
              type="button"
              className="button is-light"
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
            >
              Clear storage
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {newMovie.imdbId && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...newMovie} />
          </>
        )}
      </div>
    </>
  );
};

const movieType = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  imgUrl: PropTypes.string.isRequired,
  imdbUrl: PropTypes.string,
};

FindMovie.propTypes = {
  findMovie: PropTypes.func.isRequired,
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape(movieType).isRequired,
  ).isRequired,
};
