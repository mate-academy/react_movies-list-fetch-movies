import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { getMovie } from '../../api/api';
import movies from '../../api/movies.json';

import './FindMovie.scss';
import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovieToList }) => {
  const [title, setTitle] = useState('');
  const [showError, setShowError] = useState(false);
  const [AllInfoMovie, setAllInfoMovie] = useState({});

  const checkTitle = () => {
    handleTitle();
    setTitle(() => '');
  };

  function checkMovie(movie) {
    if (movie.Response === 'False' || !title || title[0] === ' ') {
      setShowError(true);

      return true;
    }

    return false;
  }

  async function handleTitle() {
    const movie = await getMovie(title);
    const isMovie = checkMovie(movie);

    if (isMovie) {
      return;
    }

    movies.unshift({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbId: movie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
    });
    setAllInfoMovie(() => movie);
  }

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
              value={title}
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': showError })}
              onChange={(e) => {
                setTitle(e.target.value);
                setShowError(false);
              }}
            />
          </div>

          { showError && (
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
              onClick={() => {
                checkTitle();
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovieToList(AllInfoMovie)}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard {...movies[0]} />
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovieToList: PropTypes.func.isRequired,
};
