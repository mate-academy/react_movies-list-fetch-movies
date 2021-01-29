import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [query, handleChange] = useState('');
  const [movie, setMovie] = useState(null);
  const [isLoaded, setStatusLoading] = useState(true);

  const findMovie = async() => {
    try {
      const loadedMovie = await getMovie(query);

      if (loadedMovie.Response === 'False') {
        setStatusLoading(false);

        return;
      }

      setMovie({
        title: loadedMovie.Title,
        description: loadedMovie.Plot,
        imgUrl: loadedMovie.Poster,
        imdbUrl: `https://www.imdb.com/title/${loadedMovie.imdbID}`,
        imdbId: loadedMovie.imdbID,
      });
    } catch (error) {
      setStatusLoading(!isLoaded);
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
              className={classnames({
                input: true,
                'is-danger': !isLoaded,
              })}
              onChange={(event) => {
                handleChange(event.target.value);
                setStatusLoading(true);
              }}
              value={query}
            />
          </div>

          {!isLoaded
          && (
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
              onClick={() => {
                if (movie) {
                  addMovie(movie);
                  setMovie(null);
                }
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie
        && (
          <MovieCard {...movie} />
        ) }
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
