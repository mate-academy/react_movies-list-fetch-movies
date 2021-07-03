import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classes from 'classnames';
import './FindMovie.scss';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [loadMovie, createMovie] = useState(null);
  const [isMovieFound, setIsMovieFound] = useState(false);
  const [preview, setPreview] = useState(false);
  const [isMovieInList, setIsMovieInList] = useState(false);

  const findMovie = async() => {
    const movie = await getMovie(movieTitle);

    if (movie.Response === 'False') {
      setIsMovieFound(true);
      setPreview(false);
      setIsMovieInList(false);

      return;
    }

    createMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      imdbId: movie.imdbID,
    });

    setIsMovieFound(false);
    setPreview(true);
    setIsMovieInList(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (movieTitle) {
      findMovie(movieTitle);
      setMovieTitle('');
      setIsMovieInList(true);
      setIsMovieFound(false);
    } else {
      setIsMovieFound(true);
    }
  };

  const handleChange = (e) => {
    setMovieTitle(e.target.value);

    setIsMovieFound(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={e => handleSubmit(e)}
        autoComplete="off"
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
              className={classes('input', { 'is-danger': isMovieFound })}
              autoComplete="off"
              value={movieTitle}
              onChange={handleChange}
            />
          </div>

          {isMovieFound && (
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
              onClick={() => {
                if (isMovieInList) {
                  addMovie(loadMovie);
                  setPreview(false);
                  setIsMovieInList(false);
                  setMovieTitle('');
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {preview && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...loadMovie} />
        </div>
      )}

    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
