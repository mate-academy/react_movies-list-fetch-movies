import React, { useState } from 'react';

import PropTypes from 'prop-types';
import './FindMovie.scss';
import classNames from 'classnames';

import { request } from '../../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addedMovie }) => {
  const [foundTitle, setTitle] = useState(null);
  const [newMovie, setMovie] = useState();
  const [isDanger, setDanger] = useState(false);

  const getMovie = async() => {
    const movieFromServer = await request(`${foundTitle}`);

    if (movieFromServer.Response !== 'False') {
      const { Title, Plot, Poster, imdbID } = movieFromServer;
      const movie = {
        title: Title,
        description: Plot,
        imgUrl: Poster,
        imdbUrl: `https://www.omdbapi.com/?apikey=e8bbd6b8&t=${foundTitle}`,
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
              className={classNames(
                'input', {
                  'is-danger': isDanger ? 1 : 0,
                },
              )}
              value={foundTitle}
              onChange={event => setTitle(event.target.value)}
            />
          </div>

          {newMovie === null && (
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
              onClick={getMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addedMovie(newMovie);
                setTitle('');
              }}
              disabled={newMovie ? 0 : 1}
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
