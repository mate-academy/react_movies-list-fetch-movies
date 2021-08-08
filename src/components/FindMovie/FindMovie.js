import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/movie';

export const FindMovie = ({ onClick }) => {
  const [value, setValue] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [validationOfTitle, setValidationTitle] = useState(true);

  const addMovie = () => {
    onClick(newMovie);
    setValue('');
    setNewMovie(null);
  };

  const findMovie = (movie) => {
    if (movie.Response === 'True') {
      setNewMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
    } else {
      setValidationTitle(false);
    }
  };

  async function selectMovie() {
    const movie = await getMovie(value);

    findMovie(movie);
  }

  const modification = (newValue) => {
    setValue(newValue);
    setValidationTitle(true);
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
              className={
                classNames('input', { 'is-danger': !validationOfTitle })
              }
              value={value}
              onChange={({ target }) => modification(target.value)}
            />
          </div>

          {!validationOfTitle
            && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )}
        </div>
        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={selectMovie}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {newMovie
        && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard
            {...newMovie}
          />
        </div>
        )}

    </>
  );
};

FindMovie.propTypes = {
  onClick: PropTypes.func.isRequired,
};
