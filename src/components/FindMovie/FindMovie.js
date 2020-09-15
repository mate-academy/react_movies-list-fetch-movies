import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classname from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import movies from '../../api/movies.json';
import * as api from '../../api/omdbApi';

export const FindMovie = ({ addMovie }) => {
  const [query, setQuery] = useState('');
  const [warning, setWarning] = useState(false);
  const [previewMovie, setPreview] = useState(movies[0]);

  const findMovie = async() => {
    const movie = await api.fetchMovie(query);

    movie.Response !== 'False'
      ? setPreview(
        {
          title: movie.Title,
          description: movie.Plot,
          imgUrl: movie.Poster,
          imdbUrl: `https://www.imdb.com/title${movie.imdbID}`,
          imdbId: movie.imdbID,
        },
      )
      : setWarning(true);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
        }}
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
              className={classname({
                input: true,
                'is-danger': warning,
              })}
              value={query}
              onChange={({ target }) => {
                setQuery(target.value);
                setWarning(false);
              }}
            />
          </div>
          {warning && (
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
                setQuery('');
                addMovie(previewMovie);
                setPreview(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {previewMovie
        && (
          <MovieCard {...previewMovie} />
        )}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
