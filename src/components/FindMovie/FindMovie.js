import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

import { getMovie } from '../../fetches';
import { MovieCard } from '../MovieCard';

import './FindMovie.scss';

export const FindMovie = ({ addMovie }) => {
  const [titleToFind, setMovieTitle] = useState('');
  const [foundMovie, setFoundMovie] = useState('');
  const [movieToShow, setMovieToShow] = useState('');
  const [showStatus, setShowStatus] = useState(false);

  function setTitleToFind(event) {
    const newTitleToFind = event.target.value;

    setMovieTitle(newTitleToFind);
  }

  useEffect(() => {
    getMovie(titleToFind).then((movie) => {
      setFoundMovie(movie);
    });
  }, [titleToFind]);

  function startShowing() {
    if (titleToFind.trim().length > 0) {
      setShowStatus(true);
      setMovieToShow(foundMovie);
    }
  }

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
              className={`input ${
                foundMovie.Response === 'False' && `is-danger`
              }`}
              value={titleToFind}
              onChange={event => setTitleToFind(event)}
            />
          </div>

          {foundMovie.Response === 'False' && (
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
              onClick={startShowing}
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(movieToShow, showStatus);
                setMovieTitle('');
                setShowStatus(false);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {showStatus && (<MovieCard {...movieToShow} />)}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
