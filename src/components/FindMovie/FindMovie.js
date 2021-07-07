import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getFilm } from '../../api/api';
import { MovieShape } from '../shapes/MovieShape';

export const FindMovie = ({ setMovies, movies }) => {
  const [foundMovie, setFoundMovie] = useState(null);
  const [movieTitle, setMovieTitle] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [hasServerError, setServerError] = useState(false);

  const reset = () => {
    setMovieTitle('');
    setFoundMovie(null);
  };

  const handleChange = (e) => {
    setErrorMessage('');
    setMovieTitle(e.target.value);
  };

  const onAddClick = () => {
    const isAdded = movies.some(movie => movie.imdbID === foundMovie.imdbID);

    if (isAdded) {
      setErrorMessage('Movie has been added already');
    } else {
      setMovies([...movies, foundMovie]);
      setErrorMessage('');
      reset();
    }
  };

  const getMovie = async(e) => {
    e.preventDefault();
    try {
      const film = await getFilm(movieTitle);

      if (film.Response === 'False') {
        setErrorMessage(film.Error);
      } else {
        setErrorMessage('');
      }

      setFoundMovie({
        ...film,
        imdbUrl: `https://www.imdb.com/title/${film.imdbID}`,
      });

      setServerError(false);
    } catch (error) {
      setServerError(true);
    }
  };

  return (
    <>
      <form className="find-movie" onSubmit={getMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${errorMessage && 'is-danger'}`}
              value={movieTitle}
              onChange={handleChange}
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
              disabled={!foundMovie || errorMessage}
              onClick={onAddClick}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {foundMovie && foundMovie.Response === 'True' && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...foundMovie} />
        </div>
      )}
      {hasServerError && (
        <div className="notification is-danger">
          <strong>Problem with server...Try again later</strong>
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(PropTypes.shape(MovieShape)).isRequired,
};
