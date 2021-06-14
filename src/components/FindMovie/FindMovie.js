import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [movie, setMovie] = useState(null);
  const [responseWithMovie, setResponseWithMovie] = useState(true);

  const inputHandler = (event) => {
    setTitle(event.target.value);
    setMovie(null);
    setResponseWithMovie(true);
  };

  const onFindMovie = () => {
    const url = `https://www.omdbapi.com/?t=${title}&apikey=8de92ae6`;

    fetch(url)
      .then(response => response.json())
      .then((movieFromServer) => {
        if (movieFromServer.Response === 'False') {
          setResponseWithMovie(false);

          return;
        }

        setMovie({
          title: movieFromServer.Title,
          description: movieFromServer.Plot,
          imgUrl: movieFromServer.Poster,
          imdbUrl: `https://www.imdb.com/title/${movieFromServer.imdbID}`,
          imdbId: movieFromServer.imdbID,
        });
      });
  };

  const onFormSubmit = (event) => {
    event.preventDefault();

    if (!responseWithMovie) {
      return;
    }

    addMovie(movie);
  };

  return (
    <>
      <form
        className="find-movie"
        onSubmit={onFormSubmit}
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
              className={classNames('input', {
                'is-danger': !responseWithMovie,
              })}
              value={title}
              onChange={inputHandler}
            />
          </div>

          {
            !responseWithMovie && (
              <p className="help is-danger">
                Can&apos;t find a movie with such a title
              </p>
            )
          }

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
              type="submit"
              className="button is-primary"
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      {movie ? (
        <div className="container">
          <h2 className="title">Preview</h2>
          <MovieCard {...movie} />
        </div>
      ) : (
        <span>Type movie title</span>
      )}
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
