import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [movie, setMovie] = useState('');
  const [searchError, setSearchError] = useState(false);

  const onChangeValue = (event) => {
    setValue(event.target.value);
    setSearchError(false);
    setMovie('');
  };

  const searchMovie = () => {
    if (value) {
      getMovie(value)
        .then((result) => {
          if (result.Response === 'False') {
            setSearchError(true);
            setMovie('');
          } else {
            setMovie({
              title: result.Title,
              description: result.Plot,
              imgUrl: result.Poster,
              imdbId: result.imdbID,
              imdbUrl: `https://www.imdb.com/title/${result.imdbID}`,
            });
          }
        });
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    addMovie(movie);
    setValue('');
    setMovie('');
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={handleSubmit}
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
              className={`input ${searchError ? 'is-danger' : ''}`}
              value={value}
              onChange={onChangeValue}
            />
          </div>

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
              className="button is-light"
              onClick={searchMovie}
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
          </div>
        </div>
      </form>

      {movie !== '' && !searchError && (
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
