import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/request';

export const FindMovie = ({ addMovie }) => {
  const [film, setFilm] = useState({});
  const [title, setTitle] = useState('');
  const [hasError, setError] = useState(false);

  const submitHandler = (event) => {
    setTitle(event.target.title.value);

    request(title)
      .then((response) => {
        if (response.Response === 'False' && title !== '') {
          setError(true);
        } else {
          setFilm({
            title: response.Title,
            description: response.Plot,
            imgUrl: response.Poster,
            imdbUrl: `https://www.imdb.com/title/${response.imdbID}/`,
            imdbId: response.imdbID,
          });
          setError(false);
        }
      });

    event.preventDefault();
  };

  const addMovieFormHandler = (event) => {
    if (!hasError && title !== '') {
      addMovie(film);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={submitHandler}>
        <div className="field">

          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${hasError && 'is-danger'}`}
              name="title"
            />
          </div>

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
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieFormHandler}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {!(hasError || title === '') && (
          <MovieCard {...film} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
