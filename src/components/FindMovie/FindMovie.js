import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { request } from '../api';
import { MovieCard } from '../MovieCard';
import './FindMovie.scss';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState(false);
  const [newMovie, setMovie] = useState(null);

  const searchMovie = () => {
    request(title)
      .then((data) => {
        if (data.Response === 'False') {
          setError(true);
          setMovie(null);

          return;
        }

        setMovie({
          title: data.Title,
          description: data.Plot,
          imgUrl: data.Poster,
          imdbUrl: `https://www.imdb.com/title/${data.imdbID}/`,
          imdbId: data.imdbID,
        });
        setError(false);
        setTitle('');
      });
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={(event) => {
          event.preventDefault();
          searchMovie();
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
              className={classNames(
                'input', { 'is-danger': error },
              )}
              value={title}
              onChange={(event) => {
                setTitle(event.target.value);
                setError(false);
              }}
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
              type="submit"
              className="button is-light"
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(newMovie);
                setMovie(null);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      <div className="container">
        {newMovie && (
          <>
            <h2 className="title">Preview</h2>
            <MovieCard {...newMovie} />
          </>
        )}
      </div>
    </>

  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
