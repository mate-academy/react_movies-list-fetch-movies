import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { request } from '../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [hasTitleError, setTitleError] = useState(false);
  const [isMovieError, setMovieError] = useState(false);
  const [newMovie, setMovie] = useState(null);

  const handleInputChange = (event) => {
    const { value } = event.target;

    setTitle(value);
    setTitleError(false);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    request(title)
      .then((film) => {
        if (film.Response !== 'False') {
          setMovie({
            ...film,
            title: film.Title,
            description: film.Plot,
            imdbId: film.imdbID,
            imgUrl: film.Poster,
            imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
          });
          setMovieError(false);
        } else if (film.Response === 'False') {
          setMovie(null);
          setMovieError(true);
        }
      });

    if (!title) {
      setTitleError(true);
    }
  };

  const addNewMovie = () => {
    if (!isMovieError && newMovie) {
      addMovie(newMovie);
      setMovie(null);
    }

    setMovieError(false);
    setTitle('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={handleSubmit}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              name="title"
              id="movie-title"
              placeholder="Enter a title to search"
              className="input is-danger"
              value={title}
              onChange={handleInputChange}
            />
          </div>
          {hasTitleError && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isMovieError && (
            <p className="help is-danger">
              Movie doesn&apos;t exist!
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
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {newMovie && !isMovieError
          && <MovieCard movie={newMovie} />
          }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
