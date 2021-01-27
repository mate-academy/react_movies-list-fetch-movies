import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');

  const transferFoundMovie = () => {
    addMovie(movie);
    setValue('');
    setMovie('');
  };

  const movieSearch = async() => {
    const result = await getMovie(value);

    setMovie(result);
  };

  const saveInputValue = (event) => {
    setValue(event.target.value);
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
              className={`input ${movie.Error ? 'input is-danger' : ''}`}
              value={value}
              onChange={saveInputValue}
            />
          </div>

          {movie.Error && (
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
              onClick={movieSearch}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={transferFoundMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie !== '' && !movie.Error && (
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
