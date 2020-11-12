import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import propTypes from 'prop-types';
import Loader from 'react-loader-spinner';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie, movies }) => {
  const [foundMovie, setMovie] = useState(null);
  const [title, setTitle] = useState('');
  const [error, setError] = useState(null);

  const findMovie = async() => {
    try {
      const newMovie = await getMovie(title);

      if (newMovie.Response === 'False') {
        setError('movie not found');
        setMovie(null);

        return;
      }

      setMovie({
        title: newMovie.Title,
        description: newMovie.Plot,
        imgUrl: newMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movies.imdbId}`,
        imdbId: movies.imdbID,
      });
    } catch (err) {
      setError(true);
    }
  };

  const handleChange = (event) => {
    if (event.target.value !== title) {
      setError(null);
    }

    setTitle(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (movies.some(movie => movie.imdbId === foundMovie.imdbId)) {
      setError('The movie is already on the list');

      return;
    }

    addMovie(foundMovie);
    setMovie(null);
    setTitle('');
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
              className={classNames('input', { 'is-danger': error })}
              value={title}
              onChange={handleChange}
              autoComplete="off"
            />
          </div>
          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
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
        {foundMovie ? (
          <MovieCard {...foundMovie} />
        )
          : (
            <div className="loader">
              <Loader
                type="Circles"
                color="gray"
                height={100}
                width={100}
              />
            </div>
          )
        }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: propTypes.func.isRequired,
  movies: propTypes.arrayOf(propTypes.shape({
    title: propTypes.string.isRequired,
    description: propTypes.string.isRequired,
    imgUrl: propTypes.string.isRequired,
  })).isRequired,
};
