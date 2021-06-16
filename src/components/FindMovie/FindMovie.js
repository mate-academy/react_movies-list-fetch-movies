import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';
import { getMovie } from '../../api/api';

export const FindMovie = ({ addMovie }) => {
  const [value, setValue] = useState('');
  const [results, setResults] = useState({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });
  const [filmFound, setFilmFound] = useState(false);

  const handleChange = (event) => {
    setFilmFound(false);
    setValue(event.target.value);
  };

  const findMovie = () => {
    getMovie(value)
      .then((movies) => {
        if (movies.Response === 'False') {
          return Promise.reject(setResults({
            title: '',
            description: '',
            imgUrl: '',
            imdbUrl: '',
            imdbId: '',
          }));
        }

        setResults({
          title: movies.Title,
          description: movies.Plot,
          imgUrl: movies.Poster,
          imdbUrl: movies.ImdbUrl,
          imdbId: movies.imdbID,
        });
        setValue('');

        return Promise.resolve(setFilmFound(false));
      })
      .catch(() => setFilmFound(true));
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
              className={classNames(`input`, { 'is-danger': filmFound })}
              value={value}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            { filmFound && `Can't find a movie with such a title`}
          </p>
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
                addMovie(results);
              }}
            >
              Add to the list
            </button>
          </div>
        </div>
      </form>

      <div className="container">
        <h2 className="title">Preview</h2>
        {results.imdbId ? (<MovieCard {...results} />) : 'Film not found'}
      </div>
    </>
  );
};

FindMovie.propTypes = {
  addMovie: PropTypes.func.isRequired,
};
