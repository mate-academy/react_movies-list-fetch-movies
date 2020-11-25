import React, { useState } from 'react';
import classNames from 'classnames';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { getMovie } from '../../api/api';
import { MovieCard } from '../MovieCard';
import { Buttons } from '../Buttons';
import { movieShape } from '../../shapes/movieShape';

export const FindMovie = ({ addMovie, movies }) => {
  const [foundMovie, setFoundMovie] = useState(null);
  const [error, setError] = useState(null);
  const [title, setTitle] = useState('');

  const searchMovie = async() => {
    const currentMovie = await getMovie(title);

    if (currentMovie.Responce === 'False') {
      setError('No movies found');
      setFoundMovie(null);

      return;
    }

    setFoundMovie({
      title: currentMovie.Title,
      description: currentMovie.Plot,
      imgUrl: currentMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${currentMovie.imdbID}`,
      imdbID: currentMovie.imdbID,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movies.some(movie => movie.imdbID === foundMovie.imdbID)) {
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
  movies: movieShape.isRequired,
};
