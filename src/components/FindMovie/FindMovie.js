import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState('');
  const [movieNotFound, setMovieNotFound] = useState(false);

  const findMovie = async() => {
    if (query) {
      const foundMovie = await getMovie(query);

      if (foundMovie.Response === 'True') {
        const editedMovie = {
          title: foundMovie.Title,
          description: foundMovie.Plot,
          imgUrl: foundMovie.Poster,
          imdbUrl: `https://www.imdb.com/title/${foundMovie.imdbID}`,
          imdbId: foundMovie.imdbID,
        };

        setMovie(editedMovie);
      } else {
        setMovieNotFound(true);
      }
    } else {
      setMovieNotFound(true);
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
              className="input is-danger"
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                setMovieNotFound(false);
              }}
            />
          </div>
          {movieNotFound && (
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
                addMovie(movie);
                setMovie('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        {movie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...movie} />
          </>
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
