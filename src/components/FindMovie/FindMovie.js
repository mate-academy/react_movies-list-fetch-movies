import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovieFromServer } from '../../api/api';

export const FindMovie = ({ movies, addMovie }) => {
  const [title, setTitle] = useState('');
  const [previewMovie, setMovie] = useState({});
  const [nameError, setnameError] = useState();
  const [errorState, seterrorState] = useState(false);

  const handleChange = (event) => {
    setTitle(event.target.value);
    seterrorState(false);
  };

  const handleChangeMovie = () => {
    getMovieFromServer(title)
      .then((movie) => {
        if (movie.Response === 'False') {
          seterrorState(true);
          setnameError('Can\'t find a movie with such a title');
          setMovie({});

          return;
        }

        const newMovie = {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `http://www.omdbapi.com/?apikey=70273a11&t
            =${movie.imdbID}`,
          imdbId: movie.imdbID,
        };

        setMovie(newMovie);
        seterrorState(false);
        setTitle();
      });
  };

  const handleSubmit = () => {
    const movieCheck = movies
      .some(movie => movie.imdbId
        .localeCompare(previewMovie.imdbId) === 0);

    const isMovieTitle = !(previewMovie.title === undefined);

    if (!movieCheck && isMovieTitle) {
      addMovie(previewMovie);
    }

    if (movieCheck) {
      setnameError('The movie is already on the list');
      seterrorState(true);
    }

    resetForm();
  };

  const resetForm = () => {
    setTitle();
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
              className={classNames('input', { 'is-danger': errorState })}
              name="title"
              value={title || ''}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>

          {errorState && (
            <p className="help is-danger">
              {nameError}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleChangeMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleSubmit}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {!(previewMovie.title === undefined) && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...previewMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
