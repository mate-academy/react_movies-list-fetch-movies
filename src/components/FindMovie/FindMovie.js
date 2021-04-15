import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

const baseUrl = 'https://www.omdbapi.com/?apikey=a6144313&t=';
const imdbUrl = 'https://www.imdb.com/title/';

export const FindMovie = ({ addMovie }) => {
  const [movieTitle, setMovieTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [shouldShowError, setshouldShowError] = useState(false);

  const handleInputChange = (event) => {
    setMovieTitle(event.target.value);
    setshouldShowError(false);
  };

  const changeMovieProperties = movie => ({
    imdbId: movie.imdbID,
    title: movie.Title,
    description: movie.Plot,
    imgUrl: movie.Poster,
    imdbUrl: `${imdbUrl}${movie.imdbID}`,
  });

  const findMovie = movieName => fetch(`${baseUrl}${movieName}`)
    .then(response => response.json())
    .then((movie) => {
      if (movie.Response !== 'False') {
        return changeMovieProperties(movie);
      }

      return setshouldShowError(true);
    })
    .then(movie => (movie ? setFoundMovie(movie) : setFoundMovie(null)));

  const handleSubmit = (submitEvent) => {
    submitEvent.preventDefault();
    if (!movieTitle || !foundMovie) {
      setshouldShowError(true);

      return;
    }

    addMovie(foundMovie);
    setFoundMovie(null);
    setMovieTitle('');
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
              className="input is-danger"
              value={movieTitle}
              onChange={handleInputChange}
            />
          </div>

          {
            !shouldShowError
              ? ''
              : (
                <p className="help is-danger">
                  Can&apos;t find a movie with such a title
                </p>
              )
          }
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={() => findMovie(movieTitle)}
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
      {foundMovie && (
      <div className="container">
        <h2 className="title">Preview</h2>
        <MovieCard
          {...foundMovie}
        />
      </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
