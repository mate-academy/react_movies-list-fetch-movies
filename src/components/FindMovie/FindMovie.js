import React, { useState } from 'react';

import PropTypes from 'prop-types';
import './FindMovie.scss';
import classNames from 'classnames';

import { request } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addedMovie }) => {
  const [foundTitle, setTitle] = useState('');
  const [newMovie, setMovie] = useState(null);
  const [isDanger, setDanger] = useState(false);

  const getMovie = async() => {
    const movieFromServer = await request(`${foundTitle}`);

    if (movieFromServer.Response !== 'False') {
      const { Title, Plot, Poster, imdbID } = movieFromServer;
      const movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.imdb.com/title/${imdbID}/`,
        imdbId: imdbID,
      };

      setMovie(movie);
      setDanger(false);
    } else {
      setMovie(null);
      setTitle(foundTitle);
      setDanger(true);
    }
  };

  return (
    <>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          getMovie();
        }}
        className="find-movie"
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
                'input', {
                  'is-danger': isDanger,
                },
              )}
              value={foundTitle}
              onChange={(event) => {
                setTitle(event.target.value);
                setDanger(false);
              }}
            />
          </div>

          {isDanger && (
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
              disabled={!newMovie}
              onClick={() => {
                addedMovie(newMovie);
                setTitle('');
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
  addedMovie: PropTypes.func.isRequired,
};
