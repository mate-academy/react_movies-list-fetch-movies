import React, { useState } from 'react';
import './FindMovie.css';

import PropTypes from 'prop-types';
import classNames from 'classnames';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [newMovie, setNewMovie] = useState(null);

  const handleChange = (e) => {
    const { value } = e.target;

    setTitle(value.trim());
    setError(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const clearInput = () => {
    setTitle('');
    setError(false);
    setNewMovie(null);
  };

  const findMovie = () => {
    getMovie(title)
      .then((movie) => {
        if (movie.imdbID) {
          setNewMovie({
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
        } else {
          setError(true);
          setNewMovie(null);
        }
      });
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
              value={title}
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input is-primary', {
                'is-danger': error,
              })}
              onChange={handleChange}
            />
          </div>

          {error && (
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
              onClick={() => findMovie()}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                if (newMovie) {
                  addMovie(newMovie);
                  clearInput();
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...newMovie} />
      </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
