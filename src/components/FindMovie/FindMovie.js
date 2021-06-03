import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/request';

export const FindMovie = ({ addMovie }) => {
  const [film, requestFilm] = useState({});
  const [title, setTitle] = useState('interstellar');
  const [hasError, findError] = useState(false);
  const [input, changeInput] = useState('');

  useEffect(() => {
    request(title)
      .then((response) => {
        if (response.Response === 'False') {
          findError(true);
        } else {
          requestFilm(response);
          findError(false);
        }
      });
  }, [title]);

  const filmRed = {
    title: film.Title,
    description: film.Plot,
    imgUrl: film.Poster,
    imdbUrl: `https://www.imdb.com/title/${film.imdbID}/`,
    imdbId: film.imdbID,
  };

  const searchFormHandler = (event) => {
    setTitle(event.target.title.value);
    changeInput('');
    event.preventDefault();
  };

  const addMovieFormHandler = (event) => {
    addMovie(filmRed);
    event.preventDefault();
  };

  return (
    <>
      <form onSubmit={searchFormHandler}>
        <div className="control">
          <input
            type="text"
            id="movie-title"
            placeholder="Enter a title to search"
            className="input is-danger"
            name="title"
            value={input}
            onChange={event => changeInput(event.target.value)}
          />
        </div>

        <div className="control">
          <button
            type="submit"
            className="button is-light"
          >
            Find a movie
          </button>
        </div>
      </form>

      <form className="find-movie" onSubmit={addMovieFormHandler}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          {hasError && (
          <p className="help is-danger">
            Can&apos;t find a movie with such a title
          </p>
          )}
        </div>

        <div className="field is-grouped">

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
        <MovieCard {...filmRed} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
