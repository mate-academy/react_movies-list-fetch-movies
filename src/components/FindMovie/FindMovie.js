import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ setMovies, movies }) => {
  const [movie, setMovie] = useState(null);
  const [hasError, setHasError] = useState(false);
  const [query, setQuery] = useState('');
  const [isMovieExist, setIsMovieExist] = useState(false);

  const handleChangeQuery = (event) => {
    const { value } = event.target;

    setQuery(value);
    setHasError(false);
  };

  const findMovie = async() => {
    const newMovie = await request(query);

    if (newMovie.Response === 'False') {
      setHasError(true);

      return;
    }

    setMovie({
      title: newMovie.Title,
      description: newMovie.Plot,
      imgUrl: newMovie.Poster,
      imdbID: newMovie.imdbID,
      imdbUrl: `https://www.imdb.com/title/${newMovie.imdbID}`,
    });
    setHasError(false);
    setIsMovieExist(false);
  };

  const addNewMovie = (event) => {
    event.preventDefault();

    if (!movie) {
      setHasError(true);

      return;
    }

    if (movies.some(movieInList => movie.imdbID === movieInList.imdbID)) {
      setIsMovieExist(true);

      return;
    }

    setMovies([...movies, movie]);

    setMovie(null);
    setHasError(false);
    setQuery('');
  };

  return (
    <>
      <form className="find-movie" onSubmit={addNewMovie}>
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              type="text"
              id="movie-title"
              value={query}
              placeholder="Enter a title to search"
              className={
                hasError
                  ? 'input is-danger'
                  : 'input is-success'
              }
              onChange={handleChangeQuery}
            />
          </div>

          {hasError && (
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
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {isMovieExist && (
        <h2 className="title">
          This movie is already exist
        </h2>
      )}

      {!hasError && movie && !isMovieExist && (
        <div className="container">
          <h2 className="title">
            Preview
          </h2>
          <MovieCard {...movie} />
        </div>
      )}
    </>
  );
};

FindMovie.propTypes = {
  setMovies: PropTypes.func.isRequired,
  movies: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      imgUrl: PropTypes.string.isRequired,
      imdbUrl: PropTypes.string.isRequired,
      imdbID: PropTypes.string.isRequired,
    }).isRequired,
  ).isRequired,
};
