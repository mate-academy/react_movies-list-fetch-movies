import React, { useState } from 'react';
import PropTypes from 'prop-types';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ movies, addMovie }) => {
  const [query, setQuery] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [isMovieNotFound, setIsMovieNotFound] = useState(null);

  const handleOnChange = (event) => {
    setQuery(event.target.value);
    setIsMovieNotFound(null);
    setFoundMovie(null);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    addMovie(foundMovie);
    setIsMovieNotFound(null);
    setFoundMovie(null);
  };

  const findMovie = () => {
    if (!query) {
      return;
    }

    fetch(`https://www.omdbapi.com/?apikey=29c92b6c&t=${query}`)
      .then(response => response.json())
      .then((movie) => {
        if (movie.Error) {
          setIsMovieNotFound(true);
        } else {
          setFoundMovie({
            ...movie,
            title: movie.Title,
            description: movie.Plot,
            imgUrl: movie.Poster,
            imdbUrl: `https://www.imdb.com/title/${movie.imdbID}`,
            imdbId: movie.imdbID,
          });
          setQuery('');
        }
      });
  };

  const isMovieExists = React.useCallback(() => {
    if (!foundMovie) {
      return true;
    }

    return Boolean(movies.find(movie => movie.imdbId === foundMovie.imdbId));
  }, [movies, foundMovie]);

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
              value={query}
              onChange={handleOnChange}
              placeholder="Enter a title to search"
              className="input is-danger"
            />
          </div>

          {isMovieNotFound && (
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
              onClick={findMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="submit"
              className="button is-primary"
              disabled={isMovieExists()}
            >
              Add to the list
            </button>
            <p className="help is-danger">
              {foundMovie && isMovieExists()
                ? 'You can`t add an existent movie'
                : ''
              }
            </p>
          </div>
        </div>
      </form>

      {!isMovieNotFound && foundMovie && (
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
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      imdbId: PropTypes.string.isRequired,
      Title: PropTypes.string.isRequired,
      Plot: PropTypes.string.isRequired,
      Poster: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
