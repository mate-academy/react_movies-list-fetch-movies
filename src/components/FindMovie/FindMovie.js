import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { request } from '../../api/api';

export const FindMovie = ({ addMovie, isAlreadyAdded }) => {
  const [filmTitle, setFilmTitle] = useState('');
  const [chosenFilm, chooseFilm] = useState({});
  const [err, setErr] = useState('');

  useEffect(() => {
    setErr('');
  }, [filmTitle]);

  return (
    <>
      <form className="find-movie">
        <div className="field">
          <label className="label" htmlFor="movie-title">
            Movie title
          </label>

          <div className="control">
            <input
              value={filmTitle}
              onChange={(event) => {
                setFilmTitle(event.target.value);
              }}
              type="text"
              id="movie-title"
              placeholder="Enter a title to search"
              className={`input ${err ? 'is-danger' : ''}`}
            />
          </div>

          <p className="help is-danger">
            {err}
          </p>
        </div>

        <div className="field is-grouped">
          <div className="control">
            <button
              type="button"
              className="button is-light"
              onClick={
                () => {
                  request(filmTitle).then((response) => {
                    chooseFilm(response.movie);
                    setErr(response.error);
                  });
                }
              }
            >
              Find a movie
            </button>
          </div>

          <div className="control">
            <button
              disabled={
                chosenFilm.Response === 'False'
                || isAlreadyAdded(chosenFilm)
                || !chosenFilm.title
              }
              active={false}
              type="button"
              className="button is-primary"
              onClick={() => {
                addMovie(chosenFilm);
                setFilmTitle('');
                chooseFilm({});
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>
      {
        !err && chosenFilm.title ? (
          <div className="container">
            <h2 className="title">Preview</h2>
            <MovieCard {...chosenFilm} />
          </div>
        ) : ''
      }
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
  isAlreadyAdded: PropTypes.func.isRequired,
};
