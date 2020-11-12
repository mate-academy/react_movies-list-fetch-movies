import React, { useState } from 'react';
import './FindMovie.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/Api';

export const FindMovie = ({ addNewMovie }) => {
  const [movie, setMovie] = useState();
  const [query, setQuery] = useState('');
  const [notFound, setLoadingError] = useState(false);

  const findMovie = async() => {
    const movieFromServer = await getMovie(query);

    if (movieFromServer.Response === 'True') {
      setMovie({
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster,
        imdbUrl: movieFromServer.imdbID,
      });
    } else {
      setMovie(undefined);
      setLoadingError(true);
    }
  };

  const handleChange = (event) => {
    setQuery(event.target.value);
    setLoadingError(false);
  };

  const sendMovie = () => {
    addNewMovie(movie);
    setMovie(undefined);
    setQuery('');
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
              value={query}
              onChange={handleChange}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={classNames('input', { 'is-danger': notFound })}
              autoComplete="off"
            />
          </div>

          {notFound && (
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
              type="button"
              className="button is-primary"
              onClick={sendMovie}
              disabled={!movie}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>

        {movie && (
          <MovieCard {...movie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addNewMovie: PropTypes.func.isRequired,
};
