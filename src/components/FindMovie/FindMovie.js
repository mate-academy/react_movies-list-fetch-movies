import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ setMovies, movies }) => {
  const [movie, setMovie] = useState(null);
  const [error, setError] = useState(true);
  const [query, setQuery] = useState('');
  const [isMoviePresent, setIsMoviePresent] = useState(false);

  const handleSearchQueryChange = (event) => {
    const { value } = event.target;

    setQuery(value);
    setError(false);
    setIsMoviePresent(false);
  };

  const getMovieFromServer = async() => {
    const movieFromServer = await request(query);

    if (movieFromServer.Response === 'False') {
      setError(true);

      return;
    }

    setMovie({
      title: movieFromServer.Title,
      description: movieFromServer.Plot,
      imbdId: movieFromServer.imdbID,
      imgUrl: movieFromServer.Poster,
      imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
    });
    setError(false);
  };

  const addNewMovie = (event) => {
    event.preventDefault();
    if (!movie) {
      setError(true);

      return;
    }

    if (movies.find(initialMovie => (initialMovie.title === movie.title))) {
      setIsMoviePresent(true);

      return;
    }

    setMovies([...movies, movie]);

    setQuery('');
    setMovie(null);
    setError(false);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={addNewMovie}
      >
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
              value={query}
              onChange={handleSearchQueryChange}
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
              onClick={getMovieFromServer}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={addNewMovie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {!error && (
        <div className="container">
          {isMoviePresent
            && 'This movie is already present in the list'}
          <h2 className="title">Preview</h2>
          {!error && movie && (
            <MovieCard {...movie} />
          )}
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
    }).isRequired,
  ).isRequired,
};
