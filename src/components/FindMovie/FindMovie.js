import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [query, setSearchQuery] = useState('');
  const [movie, setMovie] = useState(null);
  const [isErrorVisible, setErrorStatus] = useState(false);

  const handleSearchQuery = (event) => {
    const { value } = event.target;

    setSearchQuery(value);
    setErrorStatus(false);
  };

  const findMovie = () => {
    getMovie(query)
      .then((response) => {
        if (response.Response === 'False') {
          setErrorStatus(true);
          setSearchQuery('');

          return;
        }

        setMovie({
          title: response.Title,
          description: response.Plot,
          imgUrl: response.Poster,
          imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
          imdbId: response.imdbID,
        });

        setErrorStatus(false);
      });
  };

  const addNewMovie = (event) => {
    event.preventDefault();

    if (!movie) {
      setErrorStatus(true);

      return;
    }

    addMovie(movie);

    setSearchQuery('');
    setMovie(null);
    setErrorStatus(false);
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
              placeholder="Enter a title to search"
              value={query}
              onChange={handleSearchQuery}
              className={isErrorVisible
                ? 'input is-danger'
                : 'input is-success'}
            />
          </div>

          {isErrorVisible ? (
            <p className="help is-danger">
              Can&apos;t find a movie with such a title
            </p>
          ) : (<></>)}
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

      {!isErrorVisible ? (
        <div className="container">
          <h2 className="title">Preview</h2>
          {movie ? (
            <MovieCard {...movie} />
          ) : (
            <></>
          )}
        </div>
      ) : (
        <></>
      )
      }
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
