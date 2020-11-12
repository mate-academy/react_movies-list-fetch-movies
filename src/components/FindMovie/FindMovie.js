import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/Api';

export const FindMovie = ({ addMovie, movies }) => {
  const [newMovie, setNewMovie] = useState(null);
  const [query, setQuery] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [hasLoadingError, setHasLoadingError] = useState(false);
  const [hasBeenAdded, setHasBeenAdded] = useState(false);

  const handleChange = (event) => {
    const { value } = event.target;

    if (value !== query) {
      setHasLoadingError(false);
      setHasBeenAdded(false);
    }

    setQuery(value);
  };

  const findMovie = () => {
    getMovie(query)
      .then((movieFromServer) => {
        const movie = {
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbId}`,
          imdbId: movieFromServer.imdbID,
        };

        if (!movie.imdbId) {
          setHasLoadingError(true);
        } else {
          setNewMovie(movie);
          setDisabled(false);
        }
      });
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!movies.some(movie => movie.imdbId === newMovie.imdbId)) {
      addMovie(newMovie);

      setNewMovie(null);
      setQuery('');
      setDisabled(true);
    } else {
      setHasBeenAdded(true);
    }
  };

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
              placeholder="Enter a title to search"
              className="input"
              name="value"
              value={query}
              onChange={handleChange}
            />
          </div>

          {hasLoadingError && (
            <p className="help is-danger">
              Can&apos;t find a movie with a such title
            </p>
          )}
          {hasBeenAdded && (
            <p className="help is-danger">
              This movie has already been added
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
              disabled={disabled}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {newMovie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...newMovie} />
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
  }).isRequired).isRequired,
};
