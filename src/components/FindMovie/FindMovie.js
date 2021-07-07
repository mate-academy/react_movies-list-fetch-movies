import React, { useState } from 'react';
import './FindMovie.scss';

import cn from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';

import { getMovie } from '../../api/api';

export const FindMovie = ({
  addToList,
  isOnList,
  setExistence,
}) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundMovie, getFoundMovie] = useState('');
  const [isMovieExist, setMovieExistence] = useState(true);

  const catchTitleForMovie = (title) => {
    setMovieTitle(title);
    setMovieExistence(true);
    setExistence(false);
  };

  const getMovieFromApi = async() => {
    const movie = await getMovie(movieTitle);

    if (!movieTitle) {
      setMovieExistence(false);

      return;
    }

    if (movie.Response === 'False') {
      setMovieExistence(false);
      setMovieTitle('');

      return;
    }

    getFoundMovie({
      title: movie.Title,
      description: movie.Plot,
      imgUrl: movie.Poster,
      imdbUrl: `https://www.imdb.com/title/${movie.imdbID}/`,
      imdbId: movie.imdbID,
    });
    setMovieTitle('');
  };

  const addMovieToList = () => {
    addToList(foundMovie);
    getFoundMovie('');
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
              value={movieTitle}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              autoComplete="off"
              className={cn('input', {
                'is-danger': !isMovieExist || isOnList,
              })}
              onChange={event => catchTitleForMovie(event.target.value)}
            />
          </div>

          {!isMovieExist && (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          )}

          {isOnList && (
            <p className="help is-danger">
              The film has been already added to the list
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={getMovieFromApi}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addMovieToList}
              disabled={!foundMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {foundMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...foundMovie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addToList: PropTypes.func.isRequired,
  isOnList: PropTypes.bool.isRequired,
  setExistence: PropTypes.func.isRequired,
  movie: PropTypes.shape({
    Title: PropTypes.string.isRequired,
    Plot: PropTypes.string.isRequired,
    Poster: PropTypes.string.isRequired,
    imdbID: PropTypes.string.isRequired,
  }).isRequired,
};
