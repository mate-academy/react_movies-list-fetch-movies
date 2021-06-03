import React, { useState } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import './FindMovie.scss';

import { MovieCard } from '../MovieCard';

export const FindMovie = ({ addMovie }) => {
  const [value, setSearchTerm] = useState('');
  const [results, setSearchResults] = useState({
    title: '',
    description: '',
    imgUrl: '',
    imdbUrl: '',
    imdbId: '',
  });
  const [filmNotFound, setNotFound] = useState(false);

  const handleChange = (event) => {
    event.preventDefault();
    setSearchTerm(event.target.value);
    setNotFound(true);
  };

  const findMovie = () => {
    const API_URL = `https://www.omdbapi.com/?apikey=1e23943c&t=`;

    const result = () => fetch(`${API_URL}${value}`)
      .then(response => response.json());

    result().then(movies => setSearchResults({
      title: movies.Title,
      description: movies.Plot,
      imgUrl: movies.Poster,
      imdbUrl: movies.ImdbUrl,
      imdbId: movies.imdbID,
    }));

    if (value === '') {
      setNotFound(false);
    }

    setSearchTerm('');
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
              className={classNames(`input`, { 'is-danger': !filmNotFound })}
              value={value}
              onChange={handleChange}
            />
          </div>

          <p className="help is-danger">
            { !filmNotFound && `Can't find a movie with such a title`}
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
