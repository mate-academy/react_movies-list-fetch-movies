import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, addMovie }) => {
  const [movie, setMovie] = useState({});
  const [error, setError] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const findMovie = async() => {
    const result = await getMovie(inputValue);

    if (result.Response === 'False') {
      setError(true);

      return;
    }

    setMovie({
      title: result.Title,
      description: result.Plot,
      imgUrl: result.Poster,
      imdbUrl: `https://www.imdb.com/title/${result.imdbId}`,
      imdbId: result.imdbId,
    });
  };

  const handleChange = (value) => {
    setInputValue(value);
    setError(false);
  };

  const onSubmit = (event) => {
    event.preventDefault();

    if (movies.every(item => item.imdbId !== movie.imdbId) && !error) {
      addMovie([...movies, movie]);
    }

    setInputValue('');
    setMovie({});
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={event => onSubmit(event)}
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
              className={classNames({
                input: true,
                'is-danger': error,
              })}
              value={inputValue}
              onChange={event => handleChange(event.target.value)}
            />
          </div>

          {error
            ? (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
            : null
          }
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
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...movie} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  movies: PropTypes.arrayOf(PropTypes.objectOf(PropTypes.string)).isRequired,
  addMovie: PropTypes.func.isRequired,
};
