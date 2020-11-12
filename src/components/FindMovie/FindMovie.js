import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';
import { Buttons } from '../Buttons';

export const FindMovie = ({ addMovie, movies }) => {
  const [foundMovie, setFoundMovie] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  const searchMovie = () => {
    getMovie(title)
      .then((movie) => {
        if (movie.Response === 'False') {
          setError('No movies found');
          setFoundMovie(null);

          return;
        }

        setFoundMovie({
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title/${movie.imdbId}`,
          imdbId: movie.imdbID,
        });
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movies.some(movie => movie.imdbId === foundMovie.imdbId)) {
      addMovie(foundMovie);

      setFoundMovie(null);
      setTitle('');
    } else {
      setError('Already added');
    }
  };

  const handleChange = (event) => {
    if (event.target.value !== title) {
      setError(null);
    }

    setTitle(event.target.value);
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
            />
          </div>

          {error && (
            <p className="help is-danger">
              {error}
            </p>
          )}
        </div>

        <Buttons onClick={searchMovie} disabled={!foundMovie} />
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie && (
          <MovieCard {...foundMovie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
  }).isRequired).isRequired,
};
