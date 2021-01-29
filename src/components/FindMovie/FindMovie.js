import React, { useState } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
// import movies from '../../api/movies.json';

export const FindMovie = ({ onAddMovie }) => {
  const [query, setQuery] = useState('');
  const [movie, setMovie] = useState('');
  const [movieNotFound, setMovieNotFound] = useState(false);

  const inputClasses = classNames({
    input: true,
    'is-danger': !query && movieNotFound,
  });

  const onFindMovie = async() => {
    setMovie('');
    const response = await (
      await fetch(`http://www.omdbapi.com/?apikey=2a880529&t=${query}`)
    ).json();

    if (response.Response === 'True') {
      setMovie({
        title: response.Title,
        description: response.Plot,
        imgUrl: response.Poster,
        imdbUrl: `https://www.imdb.com/title/${response.imdbID}`,
        imdbId: response.imdbID,
      });
      setMovieNotFound(false);
    } else {
      setMovieNotFound(true);
    }

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
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={inputClasses}
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
              }}
            />
          </div>

          {movieNotFound && !query && (
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
              onClick={onFindMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                onAddMovie(movie);
                setMovie('');
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie && (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      )}

    </>
  );
};

FindMovie.propTypes = {
  onAddMovie: PropTypes.func.isRequired,
};
