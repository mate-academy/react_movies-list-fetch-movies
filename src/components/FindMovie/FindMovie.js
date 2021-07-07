import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { MovieCard } from '../MovieCard';
import { fetchMovie } from '../../api';

export const FindMovie = ({ insertMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(false);

  const findMovie = async() => {
    const currentMovie = await fetchMovie(title);

    if (currentMovie.Response === 'False') {
      setError(true);
      setMovie(null);

      return;
    }

    setError(false);

    setMovie({
      title: currentMovie.Title,
      description: currentMovie.Plot,
      imgUrl: currentMovie.Poster,
      imdbUrl: `https://www.imdb.com/title/${currentMovie.imdbID}`,
      imdbId: currentMovie.imdbID,
    });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    setTitle('');
  };

  const handleChange = (event) => {
    const { value } = event.target;

    setTitle(value);
    setError(false);
  };

  const addToList = () => {
    if (movie && title && !error) {
      insertMovie(movie);
      setMovie(null);
    }
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
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames({
                input: true,
                'is-danger': error,
              })}
              value={title}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            {error && `Can't find a movie with such a title`}
          </p>
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
              onClick={addToList}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  insertMovie: PropTypes.func.isRequired,
};
