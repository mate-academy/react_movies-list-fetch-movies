import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { searchMovie } from '../../api/service';

function convertMovie(serverMovie) {
  return {
    title: serverMovie.Title,
    description: serverMovie.Plot,
    imgUrl: serverMovie.Poster,
    imdbUrl: `https://www.imdb.com/title/${serverMovie.imdbID}/`,
    imdbId: serverMovie.imdbID,
  };
}

function onChangeValue(event, setHasError, setInputValue) {
  setHasError(false);
  setInputValue(event.target.value);
}

export const FindMovie = ({ addMovie, movies }) => {
  const [inputValue, setInputValue] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [hasError, setHasError] = useState(false);

  function addMovieToTheList() {
    addMovie(foundMovie);

    setInputValue('');
    setFoundMovie(null);
  }

  return (
    <>
      <form
        className="find-movie"
        onSubmit={async(event) => {
          event.preventDefault();

          const movieFromServer = await searchMovie(inputValue);

          if (movieFromServer.Response === 'False') {
            setHasError(true);
          } else {
            setHasError(false);
            setFoundMovie(convertMovie(movieFromServer));
          }
        }}
      >
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={inputValue}
              onChange={
                event => onChangeValue(event, setHasError, setInputValue)}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': hasError,
              })}
            />
          </div>

          {hasError
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
            : <></>
          }

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
              disabled={!foundMovie}
              onClick={() => addMovieToTheList()}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie
          ? <MovieCard {...foundMovie} />
          : <p>Use search bar to find a movie.</p>}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
  })).isRequired,
};
