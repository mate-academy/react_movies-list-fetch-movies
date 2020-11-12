import React, { useState } from 'react';
import './FindMovie.scss';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';
import { getMoviesByTitle } from '../../api/movie';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie, movies }) => {
  const [foundMovie, setFoundMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [title, setMovieTitle] = useState('');

  async function requestMovie() {
    try {
      const findedMovie = await getMoviesByTitle(title);

      if (!findedMovie.Title) {
        throw new Error(`Not found movie.`);
      }

      setFoundMovie({
        title: findedMovie.Title,
        description: findedMovie.Plot,
        imgUrl: findedMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${findedMovie.imdbID}`,
        imdbId: findedMovie.imdbID,
      });
    } catch (Error) {
      setErrorMessage(Error.message);
    }
  }

  const handleInput = (event) => {
    setErrorMessage('');
    setMovieTitle(event.target.value);
  };

  const handleFindMovie = () => {
    setFoundMovie(null);
    requestMovie(title);
  };

  const handleSubmit = () => {
    const check = movies.every(movie => movie.imdbId !== foundMovie.imdbId);

    // eslint-disable-next-line no-console
    console.log(foundMovie);
    if (check) {
      addMovie(foundMovie);
      setMovieTitle('');
      setFoundMovie(null);
    } else {
      setErrorMessage(
        'This movie is already in your list!',
      );
    }
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
              className={ClassNames('input', { 'is-danger': errorMessage })}
              onChange={handleInput}
              value={title}
            />
          </div>
          {errorMessage && (
            <p className="help is-danger">
              {errorMessage}
            </p>
          )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={handleFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleSubmit}
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
  addMovie: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    imgUrl: PropTypes.string.isRequired,
    imdbUrl: PropTypes.string.isRequired,
    imdbId: PropTypes.string.isRequired,
  })).isRequired,
};
