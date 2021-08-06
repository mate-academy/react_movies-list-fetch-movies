import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api';

import './FindMovie.scss';

export const FindMovie = ({ onAddMovie }) => {
  const [value, setValue] = useState('');
  const [newMovie, setNewMovie] = useState(null);
  const [titleEmpty, setTitleEmpty] = useState(true);
  const [isMovie, setIsMovie] = useState(false);

  const onChangeTitleAndValue = (newValue) => {
    setValue(newValue);
    setTitleEmpty(true);
  };

  const addMovie = () => {
    onAddMovie(newMovie);
    setValue('');
    setNewMovie(null);
    setIsMovie(false);
  };

  async function getData() {
    const movie = await getMovie(value);

    findMovie(movie);
  }

  const findMovie = (movie) => {
    if (movie.Response === 'True') {
      setNewMovie({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });
      setIsMovie(true);
    } else {
      setTitleEmpty(false);
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
              onChange={({ target }) => onChangeTitleAndValue(target.value)}
              value={value}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': !titleEmpty })}
            />
          </div>

          {!titleEmpty
            && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              onClick={getData}
              type="button"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={!isMovie}
              onClick={addMovie}
              type="button"
              className="button is-primary"
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
  onAddMovie: PropTypes.func.isRequired,
};
