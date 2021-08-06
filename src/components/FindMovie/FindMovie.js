import React, { useState } from 'react';
import propTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovies } from '../../api';

export const FindMovie = ({ addMovie }) => {
  const [movie, setMovie] = useState(null);
  const [query, setQuery] = useState('');
  const [checkTitle, setCheckTitle] = useState(false);

  const showMovie = async() => {
    const movieFromServer = await getMovies(query);

    if (movieFromServer.Response !== 'False') {
      setCheckTitle(false);
      setMovie({
        title: movieFromServer.Title,
        description: movieFromServer.Plot,
        imgUrl: movieFromServer.Poster,
        imdbUrl: '#',
        imdbId: movieFromServer.imdbID,
      });
    } else {
      setCheckTitle(true);
    }
  };

  const addMovieAndReset = () => {
    addMovie(movie);
    setMovie(null);
    setQuery('');
    setCheckTitle(false);
  };

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Title:
          </label>

          <div className="control">
            <input
              type="text"
              value={query}
              id="movie-title"
              placeholder="Enter a title to search"
              className="input"
              onChange={event => setQuery(event.target.value)}
            />
          </div>

          {checkTitle && (
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
              onClick={() => {
                showMovie(query);
              }}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            {movie && (
            <button
              type="button"
              className="button is-primary"
              onClick={() => addMovieAndReset()}
            >
              Add to the list
            </button>
            )}
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
  addMovie: propTypes.func.isRequired,
};
