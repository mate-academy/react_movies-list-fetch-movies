import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { loadMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState({});
  const [title, setTitle] = useState('');
  const [errorTitle, setErrorTitle] = useState(false);
  const [cardVisible, setCardVisible] = useState(false);

  const handleChange = (event) => {
    const { value } = event.target;

    setTitle(value);
    setErrorTitle(false);
  };

  const getMovie = async() => {
    try {
      const result = await loadMovie(title);

      if (result.Response === 'False') {
        setErrorTitle(true);

        return;
      }

      setMovie(result);
      setTitle('');
      setCardVisible(true);
    } catch (error) {
      setErrorTitle(true);
    }
  };

  const reset = () => {
    setMovie({});
    setTitle('');
    setCardVisible(false);
    setErrorTitle(false);
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
              className={`input ${(errorTitle) ? 'is-danger' : 'is-success'}`}
              value={title}
              onChange={handleChange}
            />
          </div>
          {errorTitle && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>
          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movie);
                reset();
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {cardVisible && (
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
