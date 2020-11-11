import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames/bind';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { loadMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState({});
  const [title, setTitle] = useState('');
  const [titleError, setTitleError] = useState(false);
  const [visibleCard, setVisibleCard] = useState(false);

  const findMovie = async() => {
    try {
      const newMovie = await loadMovie(title);

      if (!newMovie.Response) {
        setTitleError(true);

        return;
      }

      setMovie(newMovie);
      setVisibleCard(true);
      setTitle('');
    } catch (error) {
      setTitleError(true);
    }
  };

  const handleChange = (event) => {
    setTitleError(false);
    setTitle(event.target.value);
  };

  const handleReset = () => {
    setTitle('');
    setVisibleCard(false);
    setMovie({});
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
                classNames('input', { 'is-danger': titleError })
              }
              value={title}
              onChange={handleChange}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault();
                  findMovie();
                }
              }}
            />
          </div>

          {titleError && (
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
              disabled={!visibleCard}
              onClick={() => {
                addMovie(movie);
                handleReset();
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {visibleCard && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
