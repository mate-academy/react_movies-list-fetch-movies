import React, { useState } from 'react';
import './FindMovie.scss';
import ClassNames from 'classnames';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { Loader } from '../Loader';

const KEY = 'd575e7df';
const API_OMDB = `https://www.omdbapi.com/?i=tt3896198&apikey=${KEY}&`;

export const FindMovie = ({ addMovie, movies }) => {
  const [foundMovie, setFoundMovie] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [movieTitle, setMovieTitle] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const requestMovie = async(title) => {
    try {
      const response = await fetch(
        `${API_OMDB}t=${title}`,
      );
      const result = await response.json();

      if (result.Response === 'false') {
        throw new Error('No movie found. Please choose another one!');
      }

      const formatMovie = movie => ({
        title: movie.Title,
        description: movie.Plot,
        imgUrl: movie.Poster,
        imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
        imdbId: movie.imdbID,
      });

      setFoundMovie(formatMovie(result));
      setIsLoading(false);
    } catch (Error) {
      setFoundMovie(null);
      setErrorMessage(Error.message);
      setIsLoading(false);
    }
  };

  const handleInput = (event) => {
    setErrorMessage('');
    setMovieTitle(event.target.value);
  };

  const handleFindMovie = () => {
    setFoundMovie(null);
    setIsLoading(true);
    requestMovie(movieTitle);
  };

  const handleSubmit = () => {
    if (movies.every(movie => movie.imdbId !== foundMovie.imdbId)) {
      addMovie(foundMovie);
      setMovieTitle('');
      setFoundMovie(null);
    } else {
      setErrorMessage(
        'This movie is already in your list! Please choose another one.',
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
              value={movieTitle}
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
              disabled={!foundMovie} // ?
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {isLoading ? <Loader /> : foundMovie && (
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
