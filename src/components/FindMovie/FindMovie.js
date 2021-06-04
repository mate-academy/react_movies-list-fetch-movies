import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../api/api';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [movie, setMovie] = useState(null);

  const searchFilm = () => {
    getMovie(title)
      .then((foundedMovie) => {
        if (foundedMovie.Responce === 'False') {
          setError('true');

          return;
        }

        setMovie({
          title: foundedMovie.Title,
          description: foundedMovie.Plot,
          imgUrl: foundedMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${foundedMovie.imdbID}/`,
          imdbId: foundedMovie.imdbID,
        });
        setError(false);
        setTitle('');
      });
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
              className="input is-danger"
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
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
              onClick={searchFilm}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movie);
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {movie && <MovieCard {...movie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
