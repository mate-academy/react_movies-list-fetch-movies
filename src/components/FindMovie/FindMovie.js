import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import movies from '../../api/movies.json';
import { getMovie } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(movies[0]);
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
      imdbId: result.imdbID,
    });
  };

  const handleChange = (event) => {
    setError(false);

    setInputValue(event.target.value);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();

          setInputValue('');
        }}
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
              onChange={handleChange}
              autoComplete="off"
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
              type="submit"
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
              onClick={() => addMovie(movie)}
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
  addMovie: PropTypes.func.isRequired,
};
