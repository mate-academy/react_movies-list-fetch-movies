import React, { useState } from 'react';
import './FindMovie.scss';
import PropTypes from 'prop-types';

import { request } from '../api/api';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [title, setTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState(null);
  const [taskDone, setTaskDone] = useState(true);

  const searchMovie = async() => {
    if (title === '') {
      setTitle('');
      setTaskDone(false);

      return;
    }

    const movieFromServer = await request(title);

    if (movieFromServer.Response === 'False') {
      setFoundMovie(null);
      setTaskDone(false);

      return;
    }

    const { Poster, Title, Plot, imdbID } = movieFromServer;

    const prepeardMovie = ({
      imgUrl: Poster,
      title: Title,
      description: Plot,
      imdbId: imdbID,
      imdbUrl: `https://www.imdb.com/title/${imdbID}`,
    });

    setFoundMovie(prepeardMovie);
    setTaskDone(true);
  };

  const handleTitle = (event) => {
    setTitle(event.target.value);
    setTaskDone(true);
  };

  const handleAddEvent = () => {
    addMovie(foundMovie);
    setTitle('');
    setTaskDone(true);
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
              value={title}
              onChange={handleTitle}
            />
          </div>

          {!taskDone
            && (
              <p
                className="help is-danger"
              >
                Can&apos;t find a movie with such a title
              </p>
            )}
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={searchMovie}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={handleAddEvent}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {foundMovie && <MovieCard {...foundMovie} />}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
